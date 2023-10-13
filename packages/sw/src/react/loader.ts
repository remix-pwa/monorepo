import type { AssetsManifest } from '@remix-run/dev';

import { logger } from '../private/logger.js';

declare global {
  interface Window {
    __remixManifest: AssetsManifest;
    $ServiceWorkerHMRHandler$: () => Promise<void>;
  }
}

export type LoadServiceWorkerOptions = {
  serviceWorkerUrl?: string;
  serviceWorkerRegistrationCallback?: (registration: ServiceWorkerRegistration) => Promise<void> | void;
  scope?: RegistrationOptions['scope'];
  type?: RegistrationOptions['type'];
  updateViaCache?: RegistrationOptions['updateViaCache'];
};

/**
 * Load service worker in `entry.client` when the client gets hydrated.
 *
 * All parameters are optional.
 *
 * @param  serviceWorkerUrl='/entry.worker.js' - URL of the service worker.
 * @param  serviceWorkerRegistrationCallback - Callback function when the service worker gets registered. Takes in the `ServiceWorkerRegistration` object.
 * @param  scope - The service worker's registration scope.
 * @param  type - The service worker's type.
 * @param  updateViaCache - The service worker's `updateViaCache` option - controls how the browser handles updates to the service worker's script URL, and is one of the following strings:
 * - `imports` - The browser bypasses the cache and attempts to update the service worker immediately.
 * - `all` - The browser uses the cache to update the service worker.
 * - `none` - The browser doesn't use the cache to update the service worker.
 *
 * ### Example
 *
 * ```ts
 * loadServiceWorker({
 *  serviceWorkerUrl: "/entry.worker.js",
 *  scope: "/",
 *  type: "classic",
 * })
 * ```
 */
export function loadServiceWorker(
  {
    scope = '/',
    serviceWorkerRegistrationCallback = (reg: ServiceWorkerRegistration) => {
      reg.update();
    },
    serviceWorkerUrl = '/entry.worker.js',
    type = 'classic',
    updateViaCache,
  }: LoadServiceWorkerOptions = {
    scope: '/',
    type: 'classic',
    serviceWorkerRegistrationCallback: (reg: ServiceWorkerRegistration) => {
      reg.update();
    },
    serviceWorkerUrl: '/entry.worker.js',
  }
) {
  if ('serviceWorker' in navigator) {
    // eslint-disable-next-line no-inner-declarations
    async function register() {
      const syncRemixManifest = (serviceWorker: ServiceWorkerContainer = navigator.serviceWorker) => {
        serviceWorker.controller?.postMessage({
          type: 'SYNC_REMIX_MANIFEST',
          manifest: window.__remixManifest,
        });
      };

      try {
        const registration = await navigator.serviceWorker.register(serviceWorkerUrl, {
          scope,
          type,
          updateViaCache: updateViaCache || 'none',
        });

        // await serviceWorkerRegistrationCallback?.(registration); ❌

        window.$ServiceWorkerHMRHandler$ = async () => {
          await serviceWorkerRegistrationCallback?.(registration); // ✅
        };

        await navigator.serviceWorker.ready;

        if (process.env.NODE_ENV === 'development') logger.debug('Syncing manifest...');

        if (navigator.serviceWorker.controller) {
          syncRemixManifest();
        } else {
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (process.env.NODE_ENV === 'development') logger.debug('Syncing manifest...');
            syncRemixManifest();
          });
        }
      } catch (error) {
        logger.error('Service worker registration failed', error);
      }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      register();
    } else {
      window.addEventListener('load', register);
    }
  }
}
