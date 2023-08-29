import type { RemixCache } from '@remix-pwa/cache';
import { Storage, createCache } from '@remix-pwa/cache';

import type { StrategyOptions, StrategyResponse } from './types.js';
import { isHttpRequest } from './utils.js';

export interface NetworkFirstStrategyOptions extends StrategyOptions {
  /**
   * The maximum number of milliseconds to wait before considering the request to have timed out.
   * In seconds.
   *
   * Defaults to: `10`
   */
  networkTimeoutSeconds?: number;
  /**
   * A callback that will be called when the network request fails before
   * an attempt is made to retrieve from the cache. This is useful for stuffs like
   * logging errors and queueing requests.
   *
   * Defaults to `undefined`
   */
  fetchDidFail?: (() => void | (() => Promise<void>))[] | undefined;
  /**
   * A callback that will be called when the network request succeeds.
   *
   * Defaults to `undefined`
   */
  fetchDidSucceed?: (() => void | (() => Promise<void>))[] | undefined;
}

export const networkFirst = async ({
  cache: cacheName,
  cacheOptions,
  fetchDidFail = undefined,
  fetchDidSucceed = undefined,
  networkTimeoutSeconds = 10,
}: NetworkFirstStrategyOptions): Promise<StrategyResponse> => {
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

    try {
      // Much tamer version of the timeout functionality
      // const timeoutPromise = networkTimeoutSeconds !== Infinity ? timeout(networkTimeoutSeconds * 1000) : null;

      const timeoutPromise =
        networkTimeoutSeconds !== Infinity
          ? new Promise<Response>((_resolve, reject) => {
              setTimeout(() => {
                reject(new Error(`Network timed out after ${networkTimeoutSeconds} seconds`));
              }, networkTimeoutSeconds * 1000);
            })
          : null;

      const response = timeoutPromise ? await Promise.race([fetch(request), timeoutPromise]) : await fetch(request);

      if (response) {
        if (fetchDidSucceed) {
          await Promise.all(fetchDidSucceed.map(cb => cb()));
        }

        await remixCache.put(request, response.clone());

        return response;
      }
    } catch (error) {
      if (fetchDidFail) {
        await Promise.all(fetchDidFail.map(cb => cb()));
      }

      const cachedResponse = await remixCache.match(request);

      if (cachedResponse) {
        return cachedResponse;
      }

      return new Response(JSON.stringify({ message: 'Network Error' }), {
        status: 500,
      });
    }

    throw new Error('Failed to fetch. Network timed out.');
  };
};
