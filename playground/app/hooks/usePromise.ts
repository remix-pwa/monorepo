import { useState, useMemo, useCallback } from 'react';

type PromiseState<T> = {
  promise: Promise<T>;
  set: (value: T) => void;
  reset: () => void;
};

export function usePromise<T>(initialValue?: T): PromiseState<T> {
  const [data, setData] = useState<T | undefined>(initialValue);

  const promise = useMemo(() => {
    if (data === undefined) {
      return new Promise<T>(() => {});
    } else {
      return Promise.resolve(data);
    }
  }, [data]);

  const set = useCallback((value: T) => {
    setData(value);
  }, []);

  const reset = useCallback(() => {
    setData(undefined);
  }, []);

  return { promise, set, reset };
}
