import { useEffect, useState } from 'react';

/**
 * A hook to interact with the Badging API.
 *
 * Note that this doesn't track the number, so editing
 * it elsewhere won't update the hook.
 *
 * @param initialCount - The initial count for the badge (default: `0`)
 * @returns
 * - badgeCount: The current badge count
 * - increment: A function to increment the badge count
 * - decrement: A function to decrement the badge count
 * - setBadgeCount: A function to set the badge count to a specific value
 * - clearBadge: A function to clear the badge count
 * - showNotificationDot: A function to show a notification dot on your app's icon
 */
export const useBadgeApi = (initialCount = 0) => {
  const [count, setCount] = useState(initialCount);

  const increment = (incrementBy = 1) => {
    setCount(count + incrementBy);
  };

  const decrement = (decrementBy = 1) => {
    setCount(count - decrementBy);
  };

  const setBadgeCount = (newCount: number) => {
    setCount(newCount);
  };

  const showNotificationDot = () => {
    if (navigator && navigator.setAppBadge) {
      navigator.setAppBadge().catch(error => {
        console.error('Failed to set app badge:', error);
      });
    } else {
      console.warn('Badge API is not supported');
    }
  };

  const clearBadge = async (): Promise<boolean> => {
    if (navigator && navigator.clearAppBadge) {
      await navigator.clearAppBadge();
      setCount(0);
      return true;
    } else {
      console.warn('Badging API not supported');
      return false;
    }
  };

  useEffect(() => {
    if ('setAppBadge' in navigator) {
      navigator.setAppBadge(count).catch(error => {
        console.error('Failed to set app badge:', error);
      });
    } else {
      console.warn('Badge API is not supported');
    }
  }, [count]);

  return { badgeCount: count, increment, decrement, setBadgeCount, clearBadge, showNotificationDot };
};
