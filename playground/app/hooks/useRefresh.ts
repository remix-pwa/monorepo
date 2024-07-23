import { useRef } from 'react';
/**
 * description
 */
export function useRefresh() {
  const refreshCounter = useRef(0);

  const refresh = (fn: () => void) => {
    refreshCounter.current += 1;
    fn();
  };

  return { refresh, refreshCounter: refreshCounter.current };
}
