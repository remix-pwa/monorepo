import { useLocation, useRevalidator } from '@remix-run/react';
import { useEffect } from 'react';
export type UseSWEffectOptions =
  | {
      cacheType?: 'jit';
    }
  | {
      cacheType?: 'precache';
    }
  | {
      cacheType: 'custom';
      eventName: string;
      payload?: any;
    };
/**
 * This hook is used to send navigation events to the service worker.
 * It is to be called in the `root` file of your Remix application.
 */
export function useSWEffect(options: UseSWEffectOptions = { cacheType: 'jit' }): void {
  const location = useLocation();
  const revalidator = useRevalidator();
  useEffect(() => {
    revalidator.revalidate();
  }, []);
  useEffect(() => {
    let event: string;
    let payload: any = { location };
    switch (options.cacheType) {
      case 'jit':
        event = 'REMIX_NAVIGATION';
        break;
      case 'precache':
        event = 'REMIX_PRECACHE';
        break;
      case 'custom':
        event = options.eventName;
        payload = { location, ...options.payload };
        break;
      default:
        event = 'REMIX_NAVIGATION';
        break;
    }
    if ('serviceWorker' in navigator) {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller?.postMessage({
          type: event,
          payload,
        });
      } else {
        const listener = async () => {
          await navigator.serviceWorker.ready;
          navigator.serviceWorker.controller?.postMessage({
            type: event,
            payload,
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
