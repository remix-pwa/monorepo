import { BaseStrategy } from './BaseStrategy.js';
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
  async handleRequest(request: Request): Promise<Response> {
    const cache = await this.openCache();
    const response = await cache.match(request);

    if (!response) {
      throw new Error(`Couldn't locate ${request.url} in the cache!`);
    }

    await this.validateCache();

    return response;
  }

  /**
   * Validates the cache based on custom logic (e.g., max items, TTL).
   * Override this method to implement custom cache validation.
   */
  async validateCache() {
    super.cleanupCache();
    // Implement validation logic, e.g., based on max items or TTL.
  }
}
