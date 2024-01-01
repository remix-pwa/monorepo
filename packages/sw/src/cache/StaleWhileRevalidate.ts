import { BaseStrategy, CACHE_TIMESTAMP_HEADER } from './BaseStrategy.js';
import type { CacheOptions, SWROptions } from './types.js';

/**
 * StaleWhileRevalidate strategy - serves from cache, then updates the cache from the network.
 */
export class StaleWhileRevalidate extends BaseStrategy {
  // private ttl: number;
  // private notifyUpdates: boolean;

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

    const cache = await this.openCache();
    const cachedResponse = await cache.match(request);
    const networkFetch = fetch(request).then(response => this.updateCache(request, response));

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
    const timedResponse = this.addTimestampHeader(response);
    cache.put(request, timedResponse.clone());
    //   if (this.notifyUpdates) {
    //     this.notifyClientsOfUpdate(request.url);
    // }
    await this.cleanupCache();

    return timedResponse;
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
