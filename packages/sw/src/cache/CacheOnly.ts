import { BaseStrategy, CACHE_TIMESTAMP_HEADER } from './BaseStrategy.js';
import type { CacheFriendlyOptions, CacheOptions, CacheableResponseOptions } from './types.js';

/**
 * CacheOnly strategy - only serve cached assets, nothing else.
 */
export class CacheOnly extends BaseStrategy {
  cacheableResponse: CacheableResponseOptions | false;

  constructor(cacheName: string, options: CacheFriendlyOptions = {}) {
    super(cacheName, options as CacheOptions);
    this.cacheableResponse = options.cacheableResponse ?? false;
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
    const response = await cache.match(request);

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
    const timedRes = this.addTimestampHeader(response);
    await cache.put(request, timedRes);
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
    super.cleanupCache();
    // Implement validation logic, e.g., based on max items or TTL.
  }
}
