import { errorBlock } from './utils';

export const checkConnectivity = async (online: () => 'online', offline: () => 'offline') => {
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
