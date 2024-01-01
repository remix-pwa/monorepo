import { useLocation, useRevalidator } from '@remix-run/react';
import { useEffect } from 'react';
/**
 * This hook is used to send navigation events to the service worker.
 * It is to be called in the `root` file of your Remix application.
 */
export function useSWEffect(): void {
  const location = useLocation();
  const revalidator = useRevalidator();
  useEffect(() => {
    revalidator.revalidate();
  }, []);
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller?.postMessage({
          type: 'REMIX_NAVIGATION',
          location,
          manifest: window.__remixManifest,
        });
      } else {
        const listener = async () => {
          await navigator.serviceWorker.ready;
          navigator.serviceWorker.controller?.postMessage({
            type: 'REMIX_NAVIGATION',
            location,
            manifest: window.__remixManifest,
          });
        };
        navigator.serviceWorker.addEventListener('controllerchange', listener);
        return () => {
          navigator.serviceWorker.removeEventListener('controllerchange', listener);
        };
      }
    }
  }, [location]);
}
