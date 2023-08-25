import type { RouteMatch } from '@remix-run/react';
import { useLocation, useMatches } from '@remix-run/react';
import React from 'react';

let isMount = true;

/**
 * This hook is used to send navigation events to the service worker.
 * It is to be called in the `root` file of your Remix application.
 */
export function useSWEffect(): void {
  const location = useLocation();
  const matches = useMatches();

  function isPromise(p: any): boolean {
    if (p && typeof p === 'object' && typeof p.then === 'function') {
      return true;
    }
    return false;
  }

  function isFunction(p: any): boolean {
    if (typeof p === 'function') {
      return true;
    }
    return false;
  }

  React.useEffect(() => {
    const mounted = isMount;
    isMount = false;

    if ('serviceWorker' in navigator) {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller?.postMessage({
          type: 'REMIX_NAVIGATION',
          isMount: mounted,
          location,
          matches: matches.filter(filteredMatches).map(sanitizeHandleObject),
          manifest: window.__remixManifest,
        });
      } else {
        const listener = async () => {
          await navigator.serviceWorker.ready;
          navigator.serviceWorker.controller?.postMessage({
            type: 'REMIX_NAVIGATION',
            isMount: mounted,
            location,
            matches: matches.filter(filteredMatches).map(sanitizeHandleObject),
            manifest: window.__remixManifest,
          });
        };
        navigator.serviceWorker.addEventListener('controllerchange', listener);
        return () => {
          navigator.serviceWorker.removeEventListener('controllerchange', listener);
        };
      }
    }

    function filteredMatches(route: RouteMatch) {
      if (route.data) {
        return (
          Object.values(route.data).filter(elem => {
            return isPromise(elem);
          }).length === 0
        );
      }
      return true;
    }

    function sanitizeHandleObject(route: RouteMatch) {
      let handle = route.handle;

      if (handle) {
        const filterInvalidTypes = ([, value]: any) => !isPromise(value) && !isFunction(value);

        // @ts-ignore Seems like typescript had too much fun last night :(
        handle = Object.fromEntries(Object.entries(route.handle!).filter(filterInvalidTypes));
      }
      return { ...route, handle };
    }

    return () => {};
  }, [location, matches]);
}
