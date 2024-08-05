import { useState, useCallback, useRef } from 'react';

type PromiseState<T> = {
  promise: Promise<T>;
  set: (value: T) => void;
  reset: () => void;
};

export function usePromise<T>(initialValue?: T): PromiseState<T> {
  const [data, setData] = useState<T | undefined>(initialValue);
  const promiseRef = useRef<Promise<T> | null>(null);
  const resolveRef = useRef<((value: T) => void) | null>(null);

  if (!promiseRef.current) {
    promiseRef.current = new Promise<T>((resolve) => {
      resolveRef.current = resolve;
      if (data !== undefined) {
        resolve(data);
      }
    });
  }

  const set = useCallback((value: T) => {
    setData(value);

    if (value !== undefined && resolveRef.current) {
      resolveRef.current(value);
      resolveRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setData(undefined);
    promiseRef.current = null;
  }, []);

  return { 
    promise: promiseRef.current, 
    set, 
    reset 
  };
}
