export const setBadgeCount = (count: number) => {
  if (navigator && 'setAppBadge' in navigator) {
    navigator.setAppBadge(count).catch(error => {
      console.error('Failed to set app badge:', error);
    });
  } else {
    console.warn('Badge API is not supported');
  }
};

export const clearBadge = async (): Promise<boolean> => {
  try {
    if (navigator && navigator.clearAppBadge) {
      await navigator.clearAppBadge();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const isBadgingSupported = async () => {
  return !!(navigator && 'setAppBadge' in navigator && 'clearAppBadge' in navigator);
};
