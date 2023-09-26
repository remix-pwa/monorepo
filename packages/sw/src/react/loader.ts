import type { AssetsManifest } from '@remix-run/dev';

import { logger } from '../private/logger.js';

declare global {
  interface Window {
    __remixManifest: AssetsManifest;
    $ServiceWorkerHMRHandler$: () => Promise<void>;
  }
}

export type LoadServiceWorkerOptions = {
  serviceWorkerUrl: string;
  serviceWorkerRegistrationCallback: (registration: ServiceWorkerRegistration) => Promise<void> | void;
  registrationOptions: RegistrationOptions;
};

/**
 * Load service worker in `entry.client` when the client gets hydrated.
 *
 * All parameters are optional.
 *
 * @param  serviceWorkerUrl='/entry.worker.js' - URL of the service worker.
 * @param  serviceWorkerRegistrationCallback - Callback function when the service worker gets registered. Takes in the `ServiceWorkerRegistration` object.
 * @param  registrationOptions - Options for the service worker registration.
 *
 * ### Example
 *
 * ```ts
 * loadServiceWorker({
 *  serviceWorkerUrl: "/entry.worker.js",
 *  registrationOptions: {
 *    scope: "/",
 *    type: "classic",
 *    updateViaCache: "none",
 *  },
 * })
 * ```
 */
export function loadServiceWorker(
  { registrationOptions, serviceWorkerRegistrationCallback, serviceWorkerUrl }: LoadServiceWorkerOptions = {
    serviceWorkerUrl: '/entry.worker.js',
    serviceWorkerRegistrationCallback: (reg: ServiceWorkerRegistration) => {
      reg.update();
    },
    registrationOptions: {
      scope: '/',
      type: 'classic',
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
        const registration = await navigator.serviceWorker.register(serviceWorkerUrl, registrationOptions);

        // await serviceWorkerRegistrationCallback?.(registration); ❌

        window.$ServiceWorkerHMRHandler$ = async () => {
          await serviceWorkerRegistrationCallback?.(registration); // ✅
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
