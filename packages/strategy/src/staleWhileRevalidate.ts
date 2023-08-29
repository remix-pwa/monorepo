import type { RemixCache } from '@remix-pwa/cache';
import { Storage, createCache } from '@remix-pwa/cache';

import type { StrategyOptions, StrategyResponse } from './types.js';
import { isHttpRequest } from './utils.js';

export interface StaleWhileRevalidateStrategyOptions extends StrategyOptions {
  /**
   * A callback that will be called when the network request fails before
   * an attempt is made to retrieve from the cache. This is useful for stuffs like
   * logging errors and queueing requests.
   *
   * Defaults to `undefined`
   */
  fetchDidFail?: (() => void | (() => Promise<void>))[] | undefined;
}

export const staleWhileRevalidate = async ({
  cache: cacheName,
  cacheOptions,
  fetchDidFail = undefined,
}: StaleWhileRevalidateStrategyOptions): Promise<StrategyResponse> => {
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

    return remixCache.match(request).then(async response => {
      const fetchPromise = fetch(request)
        .then(async networkResponse => {
          await remixCache.put(request, networkResponse.clone());

          return networkResponse;
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch(async _err => {
          if (fetchDidFail) {
            await Promise.all(fetchDidFail.map(cb => cb()));
          }

          return new Response(JSON.stringify({ error: 'Network request failed' }), {
            status: 500,
            statusText: 'Network request failed',
          });
        });

      return response || fetchPromise;
    });
  };
};

export const swr = staleWhileRevalidate;
