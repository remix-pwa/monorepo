import { errorBlock } from './utils';

export const checkConnectivity = async (online: () => void, offline: () => void) => {
  try {
    if (navigator.onLine) {
      online();
      return { ok: true, message: 'Online' };
    } else {
      offline();
      return { ok: true, message: 'Offline' };
    }
  } catch (error) {
    return errorBlock(error);
  }
};

export const isOffline = () => 'onLine' in navigator && !navigator.onLine;
