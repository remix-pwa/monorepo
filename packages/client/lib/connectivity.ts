import { isWindowAvailable } from './user-agent';

/* eslint-disable n/no-callback-literal */
export const isOnline = () => navigator.onLine;

export const isOffline = () => !navigator.onLine;

export const handleNetworkChange = (callback: (online: boolean) => void) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  if (!isWindowAvailable()) return;

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
};
