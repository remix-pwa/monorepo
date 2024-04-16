import { useEffect, useState } from 'react';

export type PermissionName =
  | 'geolocation'
  | 'notifications'
  | 'persistent-storage'
  | 'push'
  | 'screen-wake-lock'
  | 'xr-spatial-tracking';

export type PermissionState = 'granted' | 'denied' | 'prompt';

export interface PermissionStatus {
  state: PermissionState;
}

export const usePermission = (permissionName: PermissionName) => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>({ state: 'prompt' });

  useEffect(() => {
    const getPermissionStatus = async () => {
      try {
        const status = await navigator.permissions.query({ name: permissionName });
        setPermissionStatus({ state: status.state as PermissionState });
      } catch (err) {
        console.error(`Error getting ${permissionName} permission status:`, err);
      }
    };

    getPermissionStatus();
  }, [permissionName]);

  return { permissionStatus };
};
