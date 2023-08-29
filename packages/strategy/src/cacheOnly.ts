import type { RemixCache } from '@remix-pwa/cache';
import { Storage, createCache } from '@remix-pwa/cache';

import type { StrategyOptions, StrategyResponse } from './types.js';

export interface CacheOnlyStrategyOptions extends StrategyOptions {
  /**
   * The options to pass to the cache's `match` method.
   *
   * Defaults to:
   * ```js
   * {
   *   ignoreSearch: false,
   *   ignoreVary: false,
   *   ignoreMethod: true
   * }
   *```
   *
   * @see https://developer.chrome.com/blog/cache-query-options/
   */
  cacheMatchOptions?: CacheQueryOptions;
}

export const cacheOnly = async ({
  cache: cacheName,
  cacheMatchOptions: matchOptions = { ignoreSearch: false, ignoreVary: false, ignoreMethod: true },
  cacheOptions,
}: CacheOnlyStrategyOptions): Promise<StrategyResponse> => {
  return async (request: Request | URL) => {
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

    const response = await remixCache.match(request, matchOptions);

    if (!response) {
      // Return this if it is a loader request
      // const headers = { 'X-Remix-Catch': 'yes', 'X-Remix-Worker': 'yes' };

      const req = request instanceof Request ? request : new Request(request.toString());
      const isGet = req.method.toLowerCase() === 'get';

      return new Response(
        JSON.stringify({
          message: isGet ? 'Not Found' : "No idea what you are trying to accomplish but this ain't it!",
        }),
        {
          status: isGet ? 404 : 400,
          statusText: isGet ? 'Not Found' : 'Bad Request',
        }
      );
    }

    return response;
  };
};
