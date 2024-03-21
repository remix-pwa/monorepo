import { useEffect, useState } from 'react';

export const useBadgeApi = (initialCount: number) => {
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

  return { badgeCount: count, increment, decrement, setBadgeCount, clearBadge };
};
