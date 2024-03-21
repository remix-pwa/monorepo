export const wakeLock = async (): Promise<WakeLockSentinel | undefined> => {
  try {
    if ('wakeLock' in navigator) {
      const wakeLock = await navigator.wakeLock.request('screen');

      if (wakeLock) {
        return wakeLock;
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const checkVisibility = async (isVisible: () => void, notAvailable: () => void): Promise<boolean> => {
  try {
    if (document.visibilityState) {
      const state = document.visibilityState;
      if (state === 'visible') {
        isVisible();
        return true;
      }

      return false;
    } else {
      notAvailable();
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const wakeLockSupported = () => {
  return navigator && 'wakeLock' in navigator;
};
