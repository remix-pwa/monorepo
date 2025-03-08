import { useEffect, useRef } from 'react';
import { useFetchers, useLocation, useNavigation } from 'react-router';

import { messageSW } from './utils.js';

interface Route {
  index?: boolean;
  caseSensitive?: boolean;
  id: string;
  parentId?: string;
  path?: string;
}
interface EntryRoute extends Route {
  hasAction: boolean;
  hasLoader: boolean;
  hasClientAction: boolean;
  hasClientLoader: boolean;
  hasErrorBoundary: boolean;
  imports?: string[];
  css?: string[];
  module: string;
  clientActionModule: string | undefined;
  clientLoaderModule: string | undefined;
  hydrateFallbackModule: string | undefined;
  parentId?: string;
}
interface RouteManifest<Route> {
  [routeId: string]: Route;
}

export function matchUrlToRoute(url: string, manifest: RouteManifest<EntryRoute>): string | null {
  const { pathname, searchParams } = new URL(url, window.location.origin);
  const isIndex = searchParams.has('index');

  if (isIndex) {
    for (const [id, route] of Object.entries(manifest)) {
      if (route.index && route.path === pathname) {
        return id;
      } else if (route.index && pathname === '/') {
        return id;
      }
    }
  }

  for (const [id, route] of Object.entries(manifest)) {
    if (route.path !== undefined) {
      const routeSegments = route.path.split('/').filter(Boolean);
      const urlSegments = pathname.split('/').filter(Boolean);

      if (routeSegments.length === urlSegments.length) {
        const match = routeSegments.every((segment, index) => {
          if (segment.startsWith(':')) {
            return true;
          }
          return segment === urlSegments[index];
        });

        if (match) {
          // Check if it's an index route request but the matched route is not an index
          if (isIndex && !route.index) {
            continue; // Skip this route and keep searching
          }
          return id;
        }
      }
    }
  }

  return null;
}

/**
 * A preliminary requirement for Remix PWA in Remix Single Page Apps (SPA).
 *
 * Ensure to mount at the top of your root component.
 */
export function installPWAGlobals() {
  const fetchers = useFetchers();
  const location = useLocation();
  const navigation = useNavigation();

  const originalFetchRef = useRef<typeof window.fetch>(null!);
  const prevStateRef = useRef({ fetchersState: 'idle', navigationState: 'idle' });

  useEffect(() => {
    const sendNavigationUpdate = () => {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        messageSW(navigator.serviceWorker.controller, {
          type: 'REACT_ROUTER_PWA_NAVIGATION_UPDATE',
          payload: {
            location,
          },
        });
      }
    };

    sendNavigationUpdate();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', sendNavigationUpdate);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', sendNavigationUpdate);
      }
    };
  }, [location.pathname]); // location or location.pathname????? FFS, I'M CONFUSED

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const overrideFetch = (matchedId: string) => {
      originalFetchRef.current = window.fetch;

      window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        if (typeof input === 'string' || input instanceof URL) {
          const url = new URL(input.toString());
          url.searchParams.set('_route', matchedId);
          return originalFetchRef.current.call(window, url, init);
        } else if (input instanceof Request) {
          const url = new URL(input.url);
          url.searchParams.set('_route', matchedId);
          return originalFetchRef.current.call(window, new Request(url, input));
        } else {
          // If input is not supported, just bypass and use the original fetch
          return originalFetchRef.current.call(window, input, init);
        }
      };
    };

    // @ts-expect-error
    if (window.__reactRouterContext.isSpaMode) {
      const fetchersState = fetchers.every(fetcher => fetcher.state === 'idle') ? 'idle' : 'active';
      const navigationState = navigation.state;

      if (
        (fetchersState === 'active' && prevStateRef.current.fetchersState === 'idle') ||
        (navigationState !== 'idle' && prevStateRef.current.navigationState === 'idle')
      ) {
        let url = '';

        const activeFetcher = fetchers.find(fetcher => fetcher.state !== 'idle');
        if (activeFetcher) {
          url = activeFetcher.formAction || '';
        }

        if (!url && navigationState !== 'idle') {
          url = navigation.location?.pathname || '';

          // Add search params if it contains "index"
          if (navigation.location?.search && navigation.location.search.includes('index')) {
            url += '?index';
          }
        }

        // @ts-expect-error
        const matchedRouteId = matchUrlToRoute(url, window.__reactRouterManifest.routes) ?? 'unknown';
        overrideFetch(matchedRouteId);
      }

      prevStateRef.current = { fetchersState, navigationState };
    }

    return () => {
      if (originalFetchRef.current) {
        window.fetch = originalFetchRef.current;
      }
    };
  }, [navigation.state, fetchers]);
}
