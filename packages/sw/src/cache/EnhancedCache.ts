import { openDB } from 'idb';
import { gzip, ungzip } from 'pako';

import { CACHE_TIMESTAMP_HEADER, type BaseStrategy } from './BaseStrategy.js';
import { CacheFirst } from './CacheFirst.js';
import { CacheOnly } from './CacheOnly.js';
import { NetworkFirst } from './NetworkFirst.js';
import { StaleWhileRevalidate } from './StaleWhileRevalidate.js';
import type { CacheStats, EnhancedCacheOptions, StrategyName } from './types.js';
import { mergeHeaders } from './utils.js';

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
  private cacheHits = 0;
  private totalRequests = 0;

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
  async handleRequest(request: Request | string | URL): Promise<Response> {
    this.totalRequests++;

    const response = await this.strategy.handleRequest(request);
    if (response && response.ok && response.headers.get('X-Cache-Hit') === 'true') {
      this.cacheHits++;
    }

    return response;
  }

  /**
   * Adds a timestamp header to the response.
   * @param {Response} response - The original response.
   * @returns {Response} The new response with the timestamp header.
   */
  private addTimestampHeader(response: Response): Response {
    const headers = new Headers(response.headers);
    headers.set(CACHE_TIMESTAMP_HEADER, Date.now().toString());

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
  async addToCache(request: Request | string | URL, response: Response) {
    if (typeof request === 'string' || request instanceof URL) request = new Request(request);

    const cache = await caches.open(this.cacheName);
    const timestampedResponse = this.addTimestampHeader(response);
    cache.put(request, timestampedResponse.clone());
  }

  /**
   * **A forbidden method 🤫. Use `addToCache` instead.**
   *
   * Honestly, this can potentially break cache validation and cleanup
   * entirely if used wrongly (which is all the time). Recommend using
   * `addToCache` instead.
   *
   * @param {Request} request - The request to cache.
   * @param {Response} response - The response to cache.
   */
  async __putInCache(request: Request | string, response: Response) {
    if (typeof request === 'string') request = new Request(request);

    const cache = await caches.open(this.cacheName);
    cache.put(request, response.clone());
  }

  /**
   * Manually removes a response from the cache.
   * Useful for removing responses from external sources.
   *
   * @param {Request | string | URL} request - The request to remove from the cache.
   * @returns {Promise<void>}
   */
  async removeFromCache(request: Request | string | URL): Promise<void> {
    if (typeof request === 'string' || request instanceof URL) request = new Request(request);

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
   * Provides cache statistics like cache length, cache hit ratio and total size.
   * Useful for debugging or cache inspection.
   *
   * @returns {Promise<CacheStats>}
   */
  async getCacheStats(): Promise<CacheStats> {
    const entries = await this.getCacheEntries();
    const stats: CacheStats = {
      length: entries.length,
      totalSize: 0,
      cacheDistribution: {},
      cacheHitRatio: this.totalRequests ? this.cacheHits / this.totalRequests : 0,
      cacheEfficiency: 0,
      averageCacheAge: 0,
      cacheCompressionRatio: 0,
    };

    const cacheAges = [];
    let totalUncompressedSize = 0;
    let totalCompressedSize = 0;

    for (const entry of entries) {
      const response = entry.response;
      if (response) {
        const contentType = response.headers.get('Content-Type') || 'unknown';
        const contentEncoding = response.headers.get('Content-Encoding');
        const timestamp = response.headers.get(CACHE_TIMESTAMP_HEADER) || Date.now().toString();

        const clonedResponse = response.clone();
        const contentLength = response.headers.get('Content-Length');

        const size = contentLength ? parseInt(contentLength, 10) : (await clonedResponse.blob()).size;

        if (contentEncoding === 'gzip' || contentEncoding === 'br') {
          totalCompressedSize += size;
        } else {
          totalUncompressedSize += size;
        }

        stats.cacheDistribution[contentType] = (stats.cacheDistribution[contentType] || 0) + size;
        stats.totalSize += size;
        // stats.cacheEfficiency = stats.totalSize / (1024 * 1024); // in MB
        stats.cacheEfficiency = (this.cacheHits / stats.totalSize) * 100; // in percentage
        cacheAges.push(Date.now() - parseInt(timestamp, 10));
      }
    }

    stats.averageCacheAge = cacheAges.reduce((acc, age) => acc + age, 0) / cacheAges.length / 1_000; // in seconds
    for (const contentType in stats.cacheDistribution) {
      stats.cacheDistribution[contentType] = (stats.cacheDistribution[contentType] / stats.totalSize) * 100;
    }
    stats.totalSize = stats.totalSize / 1024;
    stats.cacheCompressionRatio = totalUncompressedSize ? (totalCompressedSize / totalUncompressedSize) * 100 : 0; // in percentage

    return stats;
  }

  /**
   * Caches assets from a list of URLs.
   * Useful for pre-caching critical assets or assets that are not part of the service worker scope.
   *
   * @param {string[]} urlList - List of URLs to cache.
   * @returns {Promise<void>}
   */
  async preCacheUrls(urlList: string[]): Promise<void> {
    await Promise.all(
      urlList.map(async url => {
        const response = await fetch(url);
        if (response.ok) {
          await this.addToCache(url, response);
        }
      })
    );
  }

  /**
   * Purges cached resources based on the provided criteria.
   *
   * @param {EnhancedCache} cache - The EnhancedCache instance to use.
   * @param {(entry: { request: Request; response: Response | undefined }) => boolean} filterFn - A function that filters cache entries to be purged.
   * @returns {Promise<void>}
   */
  static async purgeCache(
    cache: EnhancedCache,
    filterFn: (entry: { request: Request; response: Response | undefined }) => boolean
  ): Promise<void> {
    const entries = await cache.getCacheEntries();
    const entriesToPurge = entries.filter(filterFn);

    const purgingPromises = entriesToPurge.map(({ request }) => cache.removeFromCache(request));
    await Promise.all(purgingPromises);
  }

  /**
   * Visualizes the cache contents in a tree-like structure.
   *
   * @param {EnhancedCache} cache - The EnhancedCache instance to use.
   * @returns {Promise<void>}
   */
  static async visualizeCache(cache: EnhancedCache): Promise<unknown> {
    const entries = await cache.getCacheEntries();

    const tree = entries.reduce((acc, { request, response }) => {
      const url = new URL(request.url);
      const path = url.pathname.split('/').filter(Boolean);
      let currentLevel: any = acc;

      for (const part of path) {
        if (!currentLevel[part]) {
          currentLevel[part] = {};
        }
        currentLevel = currentLevel[part];
      }

      currentLevel.request = request;
      currentLevel.response = response;

      return acc;
    }, {});

    return tree;
  }

  // You can extend this class easily, if you want to compress and
  // de-compress, by default.
  /**
   * Compresses a response body using Pako (zlib).
   *
   * @param {Response} response - The response to compress.
   * @returns {Promise<Response>}
   */
  static async compressResponse(response: Response): Promise<Response> {
    const compressed = gzip(await response.arrayBuffer());
    const compressedResponse = new Response(compressed, {
      headers: mergeHeaders(response.headers, {
        'Content-Encoding': 'gzip',
        'Content-Type': response.headers.get('Content-Type') || 'plain/text',
      }),
    });
    return compressedResponse;
  }

  /**
   * Decompresses a compressed response body.
   *
   * @param {Response} response - The compressed response to decompress.
   * @returns {Promise<Response>}
   */
  static async decompressResponse(response: Response): Promise<Response> {
    const decompressed = ungzip(await response.arrayBuffer());
    const decompressedResponse = new Response(decompressed, {
      headers: mergeHeaders(response.headers, {
        'Content-Type': response.headers.get('Content-Type') || 'plain/text',
      }),
    });
    return decompressedResponse;
  }

  /**
   * Persists cached resources to IndexedDB.
   *
   * @param {EnhancedCache} cache - The EnhancedCache instance to use.
   * @param {string} storeName - The name of the IndexedDB store to use.
   * @returns {Promise<void>}
   */
  static async persistCache(cache: EnhancedCache, storeName: string): Promise<void> {
    const db = await openDB('cache-store', 1, {
      upgrade(db) {
        db.createObjectStore(storeName);
      },
    });

    const entries = await cache.getCacheEntries();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);

    await Promise.all(
      entries.map(async ({ request, response }) => {
        if (response) {
          // const _cache = await caches.open(cache.cacheName);
          // const cachedResponse = await _cache.put(request, response.clone());
          await store.put(response, request.url);
        }
      })
    );

    await tx.done;
  }

  /**
   * Restores cached resources from IndexedDB.
   *
   * @param {EnhancedCache} cache - The EnhancedCache instance to use.
   * @param {string} storeName - The name of the IndexedDB store to use.
   * @param {boolean} restoreTtl - Whether to restore the previous timestamp header or not (reset time-to-live)
   * @returns {Promise<void>}
   */
  static async restoreCache(cache: EnhancedCache, storeName: string, restoreTtl = false): Promise<void> {
    const db = await openDB('cache-store', 1);
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const cursors = await store.openCursor();

    if (cursors !== null) {
      const restorePromises = [];
      for await (const cursor of cursors) {
        const request = new Request(String(cursor.key));
        const response = await cursor.value;

        if (restoreTtl) {
          restorePromises.push(cache.__putInCache(request, response));
        } else {
          restorePromises.push(cache.addToCache(request, response));
        }
      }

      await Promise.all(restorePromises);
    }

    await tx.done;
  }
}
