import type { Location } from '@remix-run/react';
import { useLocation } from '@remix-run/react';
import { useEffect, useRef } from 'react';
interface SWMessagePayload {
  location: Location<any>;
  [key: string]: any;
}

// Add debounce customisability later on...
export type UseSWEffectOptions =
  | { cacheType?: 'jit' }
  | { cacheType?: 'precache' }
  | { cacheType: 'custom'; eventName: string; payload?: SWMessagePayload };

/**
 * This hook is used to send navigation events to the service worker.
 * It is to be called in the `root` file of your Remix application.
 */
export function useSWEffect(options: UseSWEffectOptions = { cacheType: 'jit' }): void {
  const location = useLocation();
  const messageDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const sendMessageToSW = (event: string, payload: SWMessagePayload) => {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: event, payload });
      }
    };

    const handleLocationChange = () => {
      if (messageDebounceRef.current) {
        clearTimeout(messageDebounceRef.current);
      }

      messageDebounceRef.current = setTimeout(() => {
        let event: string;
        let payload: SWMessagePayload = { location };

        switch (options.cacheType) {
          case 'jit':
            event = 'REMIX_NAVIGATION';
            break;
          case 'precache':
            event = 'REMIX_PRECACHE';
            break;
          case 'custom':
            event = options.eventName;
            payload = { location, ...(options.payload || {}) };
            break;
          default:
            event = 'REMIX_NAVIGATION';
            break;
        }

        sendMessageToSW(event, payload);
      }, 25);
    };

    handleLocationChange();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleLocationChange);
    }

    return () => {
      if (messageDebounceRef.current) {
        clearTimeout(messageDebounceRef.current);
      }
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleLocationChange);
      }
    };
  }, [location]);
}
