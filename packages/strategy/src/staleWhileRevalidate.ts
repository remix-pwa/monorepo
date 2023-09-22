import type { RemixCache } from '@remix-pwa/cache';
import { Storage } from '@remix-pwa/cache';

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
  /**
   * The amount of time a cache can still be valid before it is considered stale (in milliseconds).
   *
   * Defaults to the vale of `ttl`
   */
  swr?: number;
  /**
   * Wether to use strict mode or not. If set to `true`, the strategy would never return stale
   * data and would always revalidate. If `false`, it could return stale data once before revalidating.
   *
   * Defaults to `false`
   */
  strict?: boolean;
}

export const staleWhileRevalidate = ({
  cache: cacheName,
  cacheOptions,
  cacheQueryOptions,
  fetchDidFail = undefined,
  strict = false,
  swr,
}: StaleWhileRevalidateStrategyOptions): StrategyResponse => {
  return async (request: Request | URL) => {
    if (!isHttpRequest(request)) {
      return new Response('Not a HTTP request', { status: 403 });
    }

    let remixCache: RemixCache;

    if (typeof cacheName === 'string') {
      remixCache = Storage.open(cacheName, cacheOptions);
    } else {
      remixCache = cacheName;
    }

    swr = swr ?? remixCache.ttl ?? 0;

    return remixCache.match(request, cacheQueryOptions).then(async response => {
      const res = response ? response.clone() : undefined;

      if (res && !strict) {
        const accessed = Number(res.headers.get('X-Remix-PWA-AccessTime')) ?? 0;

        if (swr! + accessed >= Date.now()) {
          return res;
        }
      }

      const fetchPromise = fetch(request)
        .then(async networkResponse => {
          await remixCache.put(request, networkResponse.clone(), strict ? swr : undefined);

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

      return response ? response.clone() : fetchPromise;
    });
  };
};

export const swr = staleWhileRevalidate;
