import { BaseStrategy, CACHE_TIMESTAMP_HEADER } from './BaseStrategy.js';
import type { CacheFriendlyOptions, CacheOptions, CacheableResponseOptions } from './types.js';

/**
 * CacheFirst strategy - prioritizes cached responses, falling back to network.
 */
export class CacheFirst extends BaseStrategy {
  cacheableResponse: CacheableResponseOptions | false;

  constructor(cacheName: string, options: CacheFriendlyOptions = {}) {
    super(cacheName, options as CacheOptions);
    this.cacheableResponse = options.cacheableResponse ?? false;
  }

  /**
   * Handles fetch requests by trying to fetch from the cache first.
   * Falls back to network if the cache doesn't contain a response.
   * @param {Request} req - The request to handle.
   * @returns {Promise<Response>} The cached or network response.
   */
  async handleRequest(req: Request | string): Promise<Response> {
    const request = this.ensureRequest(req);

    const cache = await this.openCache();
    const response = await cache.match(request.clone());

    if (!response || !(await this.validateResponse(response.clone())) || !(await this.shouldMatch(response.clone()))) {
      const _response = await fetch(request);

      if (await this.validateResponse(_response.clone())) {
        await this.putInCache(request, _response.clone());
        await this.validateCache();
      }

      return _response;
    }

    return response.clone();
  }

  /**
   * Puts a response into the cache with a remix-pwa-specific header.
   *
   * @param {Request} request - The request to cache.
   * @param {Response} response - The response to cache.
   */
  private async putInCache(request: Request, response: Response) {
    const cache = await this.openCache();
    const timestampedResponse = this.addTimestampHeader(response.clone());
    cache.put(request, timestampedResponse.clone());
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

  private async validateResponse(response: Response): Promise<boolean> {
    if (!this.cacheableResponse) {
      return true;
    }

    const { headers = {}, statuses = [] } = this.cacheableResponse;

    const isStatusValid = statuses.length > 0 ? statuses.includes(response.status) : true;
    const isHeaderValid =
      Object.keys(headers).length > 0
        ? Object.entries(headers).every(([key, value]) => response.headers.get(key) === value)
        : true;

    return isStatusValid && isHeaderValid;
  }

  private async shouldMatch(response: Response): Promise<boolean> {
    const timestamp = response.headers.get(CACHE_TIMESTAMP_HEADER);

    if (!timestamp) {
      return false;
    }

    const now = Date.now();
    const maxAge = this.options.maxAgeSeconds ?? 2_592_000;
    const isExpired = now - parseInt(timestamp, 10) > maxAge * 1_000;

    if (isExpired) {
      return false;
    }

    const maxEntries = this.options.maxEntries ?? 50;
    const cache = await this.openCache();
    const requests = await cache.keys();
    const isOverMaxEntries = requests.length > maxEntries;

    if (isOverMaxEntries) {
      return false;
    }

    return true;
  }

  /**
   * Validates the cache based on custom logic (e.g., max items, TTL).
   * Override this method to implement custom cache validation.
   */
  private async validateCache() {
    await super.cleanupCache();
  }
}
