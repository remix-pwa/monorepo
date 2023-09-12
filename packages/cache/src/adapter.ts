import { totalTtl, type Cache as CachifiedCache } from 'cachified';

import type { RemixCache } from './cache.js';

/**
 * `RemixCache` adapter for cachified.
 *
 * @param cache RemixCache instance
 * @returns cachified `Cache`
 */
export const remixCacheAdapter = (cache: RemixCache): CachifiedCache => {
  return {
    name: cache.name,
    async get(key: string) {
      const response = await cache.match(key);
      if (!response) return;
      const value = await response.json();
      return value;
    },
    async set(key: string, value: any) {
      const ttl = totalTtl(value?.metadata);
      const response = new Response(JSON.stringify(value));
      return await cache.put(key, response, ttl === Infinity ? undefined : ttl);
    },
    async delete(key: string) {
      return await cache.delete(key);
    },
  };
};
