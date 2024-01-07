import type { BaseStrategy } from './BaseStrategy.js';
import { CacheFirst } from './CacheFirst.js';
import { CacheOnly } from './CacheOnly.js';
import { NetworkFirst } from './NetworkFirst.js';
import { StaleWhileRevalidate } from './StaleWhileRevalidate.js';
import type { CacheStats, EnhancedCacheOptions, StrategyName } from './types.js';

export class EnhancedCache {
  private cacheName: string;
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

  async handleRequest(request: Request | string): Promise<Response> {
    return await this.strategy.handleRequest(request);
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
    await cache.put(request, response);
  }

  /**
   * Manually removes a response from the cache.
   * Useful for removing responses from external sources.
   *
   * @param {Request | string} request - The request to remove from the cache.
   * @returns {Promise<void>}
   */
  async removeFromCache(request: Request | string): Promise<void> {
    if (typeof request === 'string') request = new Request(request);

    const cache = await caches.open(this.cacheName);
    await cache.delete(request);
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
        response: await cache.match(request),
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
        if (response.ok) cache.put(url, response);
      });
    });
  }
}
