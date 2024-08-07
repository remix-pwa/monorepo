import { isHttpRequest } from '../utils/utils.js';
import { BaseStrategy } from './BaseStrategy.js';
import type { CacheOptions, SWROptions } from './types.js';
import { mergeHeaders } from './utils.js';

/**
 * StaleWhileRevalidate strategy - serves from cache, then updates the cache from the network.
 */
export class StaleWhileRevalidate extends BaseStrategy {
  // private ttl: number;
  // private notifyUpdates: boolean;
  // For concurrency management
  private inProgressRequests: Map<string, Promise<Response>> = new Map();

  // TODO(ShafSpecs): Add cacheableResponse capabilities to SWR!

  constructor(cacheName: string, options: SWROptions = {}) {
    super(cacheName, options as CacheOptions);
  }

  /**
   * Handles fetch requests by serving stale content from cache and revalidating from the network.
   * @param {Request} request - The request to handle.
   * @returns {Promise<Response>} The response from the cache or network.
   */
  async handleRequest(req: Request | string): Promise<Response> {
    const request = this.ensureRequest(req);

    if (!isHttpRequest(request) || !this.isRouteSupported(request)) {
      return fetch(request);
    }

    const cache = await this.openCache();
    let cachedResponse = await cache.match(request.clone(), this.options.matchOptions);

    if (cachedResponse) {
      cachedResponse = new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers: mergeHeaders(cachedResponse.headers, { 'X-Cache-Hit': 'true' }),
      });
    }

    // De-duping requests to the same URL (should I implement this for the rest?)
    const inProgressRequest = this.inProgressRequests.get(request.url);
    if (inProgressRequest) {
      // Serve the cached response immediately,
      // and let the in-progress request handle the background fetch
      return cachedResponse || inProgressRequest;
    }

    const networkFetch = fetch(request).then(async response => {
      if (this.isOpaqueResponse(response)) return response;

      // Do a more grandiose, customisable validation
      // if (response.ok) await this.updateCache(request, response.clone());
      const res = await this.updateCache(request, response.clone());
      this.inProgressRequests.delete(request.url);
      return res;
    });

    this.inProgressRequests.set(request.url, networkFetch);

    return cachedResponse || networkFetch;
  }

  /**
   * Updates the cache with a new response from the network.
   * @param {Request} request - The request associated with the response.
   * @param {Response} response - The response to cache.
   */
  async updateCache(request: Request, response: Response) {
    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`);
    }

    const cache = await this.openCache();
    const timedResponse = this.addTimestampHeader(response.clone());
    cache.put(request, timedResponse.clone());
    //   if (this.notifyUpdates) {
    //     this.notifyClientsOfUpdate(request.url);
    // }
    await this.cleanupCache();

    return timedResponse;
  }

  /**
   * Notifies clients (pages) that a newer version of a resource is available.
   * @param {string} url - The request associated with the updated resource.
   */
  // private async notifyClientsOfUpdate(url: string) {
  // const clients = await self.clients.matchAll();
  // for (const client of clients) {
  //     client.postMessage({
  //         type: 'CACHE_UPDATED',
  //         cache: 'cache-name',
  //         url: url
  //     });
  // }
  // }
}
