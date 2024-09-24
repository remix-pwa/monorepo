/* eslint-disable n/no-callback-literal */
import { useEffect, useSyncExternalStore } from 'react';

const subscribeToNetworkConnectivity = (callback: () => void) => {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
};

const getNetworkConnectivitySnapshot = () => window.navigator.onLine;

const getNetworkConnectivityServerSnapshot = () => false;

export const useNetworkConnectivity = (
  options: {
    onOnline?: (isOnline: boolean) => void;
    onOffline?: (isOnline: boolean) => void;
  } = {}
) => {
  const isOnline = useSyncExternalStore(
    subscribeToNetworkConnectivity,
    getNetworkConnectivitySnapshot,
    getNetworkConnectivityServerSnapshot
  );

  useEffect(() => {
    if (isOnline) {
      options.onOnline && options.onOnline(true);
    } else if (options.onOnline) {
      options.onOffline && options.onOffline(false);
    }
  }, [isOnline, options]);

  return isOnline;
};
