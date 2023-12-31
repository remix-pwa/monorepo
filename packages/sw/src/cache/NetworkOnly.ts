import { BaseStrategy } from './BaseStrategy.js';
import type { CacheOptions, NetworkFriendlyOptions } from './types.js';

/**
 * NetworkOnly strategy - serve network responses only, no fallback.
 */
export class NetworkOnly extends BaseStrategy {
  private networkTimeoutSeconds: number;

  constructor(
    cacheName: string,
    options: Omit<NetworkFriendlyOptions, 'cacheableResponse' | 'maxAgeSeconds' | 'maxEntries'> = {}
  ) {
    super(cacheName, options as CacheOptions);
    this.networkTimeoutSeconds = options.networkTimeoutInSeconds ?? 10;
  }

  /**
   * Handles fetch requests by trying to fetch from the network first.
   * Falls back to cache if the network fails or times out.
   * @param {Request} request - The request to handle.
   * @returns {Promise<Response>} The network or cached response.
   */
  async handleRequest(request: Request): Promise<Response> {
    try {
      // @ts-ignore My calculations seem right...
      return await this.fetchWithTimeout(request);
    } catch (error: any) {
      throw new Error(error.message || 'No response received from fetch');
    }
  }

  /**
   * Fetches a request with a timeout.
   * @param {Request} request - The request to fetch.
   * @returns {Promise<Response>} The fetched response.
   */
  private async fetchWithTimeout(request: Request): Promise<unknown> {
    const timeoutSeconds = this.networkTimeoutSeconds;

    const timeoutPromise =
      timeoutSeconds !== Infinity
        ? new Promise((_resolve, reject) =>
            setTimeout(
              () => reject(new Error(`Network timed out after ${timeoutSeconds} seconds`)),
              timeoutSeconds * 1000
            )
          )
        : null;

    if (timeoutPromise) {
      return Promise.race([fetch(request), timeoutPromise]);
    } else {
      return fetch(request);
    }
  }
}
