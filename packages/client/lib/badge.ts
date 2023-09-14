import { errorBlock } from './utils';

export const setBadge = async (unreadCount: number) => {
  try {
    if (navigator.setAppBadge) {
      await navigator.setAppBadge(unreadCount);
      return { ok: true, message: 'Set app badge successfully' };
    } else {
      return {
        ok: false,
        message: 'Badging API not supported',
      };
    }
  } catch (error) {
    return errorBlock(error);
  }
};

export const clearBadge = async () => {
  try {
    if (navigator.clearAppBadge) {
      await navigator.clearAppBadge();
      return { ok: true, message: 'Cleared app badges' };
    } else {
      return { ok: false, message: 'Badging API not supported' };
    }
  } catch (error) {
    return errorBlock(error);
  }
};

export const badgingSupported = async () => {
  try {
    return !!('setAppBadge' in navigator && 'clearAppBadge' in navigator);
  } catch (error) {
    return errorBlock(error);
  }
};
