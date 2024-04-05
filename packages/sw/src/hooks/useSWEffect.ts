import type { Location } from '@remix-run/react';
import { useLocation } from '@remix-run/react';
import { useEffect, useRef } from 'react';
interface SWMessagePayload {
  /**
   * The current location of the application.
   */
  location: Location<any>;
  /**
   * This flag is used to determine if the current navigation event is the first
   * render of the application. This is useful for the service worker to determine
   * full document requests (when `isSsr` is `true`) and client-side navigations.
   */
  isSsr: boolean;
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
  const isFirstRender = useRef(true);

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
        let payload: SWMessagePayload = { location, isSsr: isFirstRender.current };

        switch (options.cacheType) {
          case 'jit':
            event = 'REMIX_NAVIGATION';
            break;
          case 'precache':
            event = 'REMIX_PRECACHE';
            break;
          case 'custom':
            event = options.eventName;
            payload = { ...payload, ...(options.payload || {}) };
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
      if (isFirstRender.current) isFirstRender.current = false;
    };
  }, [location]);
}
