import { BaseStrategy, CACHE_TIMESTAMP_HEADER } from './BaseStrategy.js';
import type { CacheFriendlyOptions, CacheOptions, CacheableResponseOptions } from './types.js';

/**
 * `CacheOnly` strategy - only serve cached assets, nothing else.
 *
 * Note, this strategy is not recommended for most use cases, as it will
 * not handle network requests at all. It's useful for assets that are
 * expected to be in the cache, and should not be updated.
 *
 * Keep in mind that time-to-live (TTL) and other cache validation still
 * work with this strategy. So if you want to store items forever (a long time),
 * you'll need to use a high `maxAgeSeconds` value (like 1 year+) and/or manually
 * manage the cache.
 */
export class CacheOnly extends BaseStrategy {
  constructor(cacheName: string, options: Omit<CacheFriendlyOptions, 'cacheableResponse'> = {}) {
    super(cacheName, options as CacheOptions);
  }

  /**
   * Handles fetch requests by trying to fetch from the cache first.
   * Falls back to network if the cache doesn't contain a response.
   * @param {Request} request - The request to handle.
   * @returns {Promise<Response>} The cached or network response.
   */
  async handleRequest(req: Request | string): Promise<Response> {
    const request = this.ensureRequest(req);

    const cache = await this.openCache();
    const response = await cache.match(request.clone());

    if (!response) {
      throw new Error(`Couldn't locate ${request.url} in the cache!`);
    }

    await this.validateCache();

    return response;
  }

  /**
   * Manually adds a response to the cache.
   * Useful for caching responses from external sources.
   *
   * @param {Request} request - The request to cache.
   * @param {Response} response - The response to cache.
   */
  async addToCache(request: Request, response: Response) {
    const cache = await caches.open(this.cacheName);
    const timedRes = this.addTimestampHeader(response.clone());
    await cache.put(request, timedRes.clone());
  }

  /**
   * Adds a timestamp header to the response.
   * @param {Response} response - The original response.
   * @returns {Response} The new response with the timestamp header.
   */
  private addTimestampHeader(response: Response): Response {
    const headers = new Headers(response.headers);
    headers.append(CACHE_TIMESTAMP_HEADER, Date.now().toString());

    const timestampedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });

    return timestampedResponse;
  }

  /**
   * Validates the cache based on custom logic (e.g., max items, TTL).
   * Override this method to implement custom cache validation.
   */
  private async validateCache() {
    await super.cleanupCache();
  }
}
