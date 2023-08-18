import type { Cache as CachifiedCache } from 'cachified';

export const remixCacheAdapter = (cache: Cache): CachifiedCache => {
  return {
    async get(key: string) {
      const response = await cache.match(key);
      if (!response) return;
      const value = await response.json();
      return value;
    },
    async set(key: string, value: any) {
      const response = new Response(JSON.stringify(value));
      return await cache.put(key, response);
    },
    async delete(key: string) {
      return await cache.delete(key);
    },
  };
};
