import type { RemixCache } from '@remix-pwa/cache';
import { Storage } from '@remix-pwa/cache';

import type { StrategyOptions, StrategyResponse } from './types.js';
import { isHttpRequest } from './utils.js';

export interface CacheOnlyStrategyOptions extends StrategyOptions {}

export const cacheOnly = ({
  cache: cacheName,
  cacheOptions,
  cacheQueryOptions,
}: CacheOnlyStrategyOptions): StrategyResponse => {
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

    const response = await remixCache.match(request, cacheQueryOptions);

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

    return response.clone();
  };
};
