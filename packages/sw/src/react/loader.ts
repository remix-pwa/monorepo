import type { AssetsManifest } from '@remix-run/dev';

import { logger } from '../private/logger.js';

declare global {
  interface Window {
    __remixManifest: AssetsManifest;
    $ServiceWorkerHMRHandler$: () => Promise<void>;
  }
}

export type LoadServiceWorkerOptions = RegistrationOptions & {
  serviceWorkerUrl?: string;
  serviceWorkerRegistrationCallback?: (registration: ServiceWorkerRegistration) => Promise<void> | void;
};

/**
 * Load service worker in `entry.client` when the client gets hydrated.
 *
 * All parameters are optional.
 *
 * @param  options - Options for loading the service worker.
 * @param  options.serviceWorkerUrl='/entry.worker.js' - URL of the service worker.
 * @param  options.serviceWorkerRegistrationCallback - Callback function when the service worker gets registered.
 * @param  options.registrationOptions - Options for the service worker registration.
 *
 * ### Example
 *
 * ```ts
 * loadServiceWorker({
 *  scope: "/",
 *  serviceWorkerUrl: "/entry.worker.js"
 * })
 * ```
 */
export function loadServiceWorker(
  { serviceWorkerRegistrationCallback, serviceWorkerUrl, ...options }: LoadServiceWorkerOptions = {
    scope: '/',
    serviceWorkerUrl: '/entry.worker.js',
    serviceWorkerRegistrationCallback: (reg: ServiceWorkerRegistration) => {
      reg.update();
    },
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
        const registration = await navigator.serviceWorker.register(serviceWorkerUrl!, options);

        // await serviceWorkerRegistrationCallback?.(registration); ❌

        window.$ServiceWorkerHMRHandler$ = async () => {
          await serviceWorkerRegistrationCallback?.(registration);
        };

        await navigator.serviceWorker.ready;

        logger.debug('Syncing manifest...');

        if (navigator.serviceWorker.controller) {
          syncRemixManifest();
        } else {
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            logger.debug('Syncing manifest...');
            syncRemixManifest();
          });
        }
      } catch (error) {
        // console.error('Service worker registration failed', error);
      }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      register();
    } else {
      window.addEventListener('load', register);
    }
  }
}
