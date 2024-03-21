/* eslint-disable n/no-callback-literal */
import { useEffect, useState } from 'react';

import { isWindowAvailable } from '../lib/user-agent';

export const useNetworkConnectivity = (options: {
  onOnline?: (isOnline: boolean) => void;
  onOffline?: (isOnline: boolean) => void;
}) => {
  const [isOnline, setIsOnline] = useState(isWindowAvailable() ? navigator.onLine : false);

  const handleOnline = () => {
    setIsOnline(true);
    options.onOnline && options.onOnline(true);
  };

  const handleOffline = () => {
    setIsOnline(false);
    options.onOffline && options.onOffline(false);
  };

  useEffect(() => {
    if (isWindowAvailable()) {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return { isOnline };
};
