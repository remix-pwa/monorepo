import { CACHE_TIMESTAMP_HEADER, type BaseStrategy } from './BaseStrategy.js';
import { CacheFirst } from './CacheFirst.js';
import { CacheOnly } from './CacheOnly.js';
import { NetworkFirst } from './NetworkFirst.js';
import { StaleWhileRevalidate } from './StaleWhileRevalidate.js';
import type { CacheStats, EnhancedCacheOptions, StrategyName } from './types.js';

/**
 * EnhancedCache is a wrapper around the different caching strategies.
 *
 * Enhances caching in Remix PWA with features like cache stats (for monitoring cache usage),
 * cache inspection (for debugging), cache updates and versioning (for updating cached assets).
 *
 * ### Example
 *
 * ```js
 * const cache = new EnhancedCache('my-cache', {
 *  version: 'v1',
 *  strategy: 'NetworkFirst',
 *  strategyOptions: {
 *   networkTimeoutInSeconds: 5
 *  }
 * });
 * ```
 */
export class EnhancedCache {
  readonly cacheName: string;
  private strategy: BaseStrategy;

  constructor(cacheName: string, options: EnhancedCacheOptions = {}) {
    this.cacheName = `${cacheName}-${options.version || 'v1'}`;
    // Selects the strategy based on the given options
    this.strategy = this.selectStrategy(options.strategy, options.strategyOptions);
  }

  selectStrategy(strategyName: StrategyName | undefined, options: any) {
    switch (strategyName) {
      case 'CacheFirst':
        return new CacheFirst(this.cacheName, options);
      case 'CacheOnly':
        return new CacheOnly(this.cacheName, options);
      case 'NetworkFirst':
        return new NetworkFirst(this.cacheName, options);
      case 'StaleWhileRevalidate':
        return new StaleWhileRevalidate(this.cacheName, options);
      default:
        return new NetworkFirst(this.cacheName, options);
    }
  }

  /**
   * Handle a request using the selected caching strategy.
   *
   * @param request - The request to dynamically handle.
   * @returns {Promise<Response>} The response from the cache or network.
   */
  async handleRequest(request: Request | string): Promise<Response> {
    return await this.strategy.handleRequest(request);
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
   * Manually adds a response to the cache.
   * Useful for caching responses from external sources.
   *
   * @param {Request} request - The request to cache.
   * @param {Response} response - The response to cache.
   */
  async addToCache(request: Request | string, response: Response) {
    if (typeof request === 'string') request = new Request(request);

    const cache = await caches.open(this.cacheName);
    const timestampedResponse = this.addTimestampHeader(response);
    cache.put(request, timestampedResponse.clone());
  }

  /**
   * Manually removes a response from the cache.
   * Useful for removing responses from external sources.
   *
   * @param {Request | string | URL} request - The request to remove from the cache.
   * @returns {Promise<void>}
   */
  async removeFromCache(request: Request | string | URL): Promise<void> {
    if (typeof request === 'string') request = new URL(request);

    const cache = await caches.open(this.cacheName);
    await cache.delete(request);
  }

  /**
   * Retrieves a cached response.
   *
   * @param request - The request to match against the cache.
   * @returns - The cached response or undefined if not found.
   */
  async match(request: Request | string): Promise<Response | undefined> {
    if (typeof request === 'string') request = new Request(request);

    const cache = await caches.open(this.cacheName);
    return await cache.match(request);
  }

  /**
   * Clears the entire cache.
   */
  async clearCache() {
    const cache = await caches.open(this.cacheName);
    const requests = await cache.keys();
    return Promise.all(requests.map(request => cache.delete(request)));
  }

  /**
   * Retrieves all cached requests and their corresponding responses.
   * Useful for debugging or cache inspection.
   *
   * @returns {Promise<Array<{request: Request, response: Response | undefined}>>}
   */
  async getCacheEntries(): Promise<Array<{ request: Request; response: Response | undefined }>> {
    const cache = await caches.open(this.cacheName);
    const requests = await cache.keys();
    const entries = await Promise.all(
      requests.map(async request => ({
        request,
        response: (await cache.match(request))?.clone(),
      }))
    );

    return entries;
  }

  /**
   * Provides cache statistics like number of items and total size.
   * Useful for debugging or cache inspection.
   * @returns {Promise<CacheStats>}
   */
  async getCacheStats(): Promise<CacheStats> {
    const entries = await this.getCacheEntries();
    const stats = {
      itemCount: entries.length,
      totalSize: 0,
    };

    for (const entry of entries) {
      const response = entry.response;
      if (response) {
        const clonedResponse = response.clone();
        const blob = await clonedResponse.blob();
        stats.totalSize += blob.size;
      }
    }

    return stats;
  }

  /**
   * Updates cached assets with a newer version if available.
   * Requires server to indicate asset version in response headers.
   *
   * @param {string[]} urlList - List of URLs to check for newer versions.
   * @param {string} header - Header name to check for asset version.
   * @returns {Promise<void>}
   */
  // Middlewares should expand this beyond just actions/loaders
  async updateAssetsIfNewer(urlList: string[], header = 'X-Asset-Version'): Promise<void> {
    const cache = await caches.open(this.cacheName);

    urlList.forEach(async url => {
      const cachedResponse = await cache.match(url);

      if (!cachedResponse) return;

      const cachedVersion = cachedResponse.headers.get(header) ?? 'undefined';
      const response = await fetch(url);
      const newVersion = response.headers.get(header) ?? 'undefined';

      if (newVersion !== cachedVersion && response.ok) {
        await cache.put(url, response);
      }
    });
  }

  /**
   * Caches assets from a list of URLs.
   * Useful for pre-caching critical assets or assets that are not part of the service worker scope.
   *
   * @param {string[]} urlList - List of URLs to cache.
   * @returns {Promise<void>}
   */
  async preCacheUrls(urlList: string[]): Promise<void> {
    const cache = await caches.open(this.cacheName);

    urlList.forEach(url => {
      fetch(url).then(response => {
        if (response.ok) {
          const modifiedRes = this.addTimestampHeader(response.clone());
          cache.put(url, modifiedRes);
        }
      });
    });
  }
}
