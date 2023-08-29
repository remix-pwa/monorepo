import type { RemixCache } from '@remix-pwa/cache';
import { Storage, createCache } from '@remix-pwa/cache';

import type { StrategyOptions, StrategyResponse } from './types.js';
import { isHttpRequest } from './utils.js';

export interface CacheFirstStrategyOptions extends StrategyOptions {
  /**
   * A callback that will be called when the network request fails before
   * an attempt is made to retrieve from the cache. This is useful for stuffs like
   * logging errors and queueing requests.
   *
   * Defaults to `undefined`
   */
  fetchDidFail?: (() => void | (() => Promise<void>))[] | undefined;
}

export const cacheFirst = async ({
  cache: cacheName,
  cacheOptions,
  fetchDidFail = undefined,
}: CacheFirstStrategyOptions): Promise<StrategyResponse> => {
  return async (request: Request | URL) => {
    if (!isHttpRequest(request)) {
      return new Response('Not a HTTP request', { status: 403 });
    }

    let remixCache: RemixCache;

    if (typeof cacheName === 'string') {
      Storage.init();
      remixCache = Storage.has(cacheName)
        ? (Storage.get(cacheName) as RemixCache)
        : createCache({ name: cacheName, ...cacheOptions });
    } else {
      Storage.init();
      remixCache = cacheName;
    }

    const response = await remixCache.match(request);

    if (!response) {
      try {
        const networkResponse = await fetch(request);

        remixCache.put(request, networkResponse.clone());

        return networkResponse;
      } catch (err) {
        if (fetchDidFail) {
          await Promise.all(fetchDidFail.map(cb => cb()));
        }

        throw err;
      }
    }

    return response;
  };
};
