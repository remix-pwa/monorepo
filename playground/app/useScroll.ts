import { useEffect, useState } from 'react';

export const useScrollThreshold = (scrollThreshold: number = 50) => {
  const [isPastThreshold, setIsPastThreshold] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsPastThreshold(window.scrollY > scrollThreshold);
    };

    if (typeof window === 'undefined') return;

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [scrollThreshold]);

  return isPastThreshold;
};
