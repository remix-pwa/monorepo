export enum Strategy {
  /**
   * Cache first, then network.
   */
  CacheFirst = 'cache-first',
  /**
   * Network first, then cache.
   */
  NetworkFirst = 'network-first',
  /**
   * Cache only, no network.
   *
   * @note This is the only strategy that does not use the network. If you have
   * a use case for this, don't forget to populate the cache yourself.
   */
  CacheOnly = 'cache-only',
  /**
   * Network Only, no caching.
   *
   * @note This is the only strategy that does not use the cache. Technically,
   * if you have a cache that is not persistent, don't use `RemixCache` at all. Just
   * use `fetch` directly (Remix default behaviour).
   */
  NetworkOnly = 'network-only',
  /**
   * Stale while revalidate.
   *
   * @note This strategy will return stale data while fetching fresh data in the background.
   */
  StaleWhileRevalidate = 'stale-while-revalidate',
}

interface CustomCache extends Omit<Cache, 'add' | 'addAll' | 'matchAll'> {
  put(request: RequestInfo | URL, response: Response, ttl?: number): Promise<void>;
}

export type RemixCacheOptions = {
  /**
   * The name of the cache. Ensure this is unique for each cache.
   * @required
   */
  name: string;
  /**
   * The caching strategy to use.
   * @default Strategy.NetworkFirst
   */
  strategy?: Strategy;
  // todo: Add allow stale option, wether you want to return stale data after it's ttl or just return undefined.
  /**
   * The maximum number of entries to store in the cache.
   * @default 100
   */
  maxItems?: number;
  /**
   * The time-to-live of the cache in ms.
   * @default Infinity
   */
  ttl?: number;
};

export class RemixCache implements CustomCache {
  /**
   * Required
   *
   * The name of the cache. Ensure this is unique for each cache.
   * @readonly
   */
  public readonly name: string;
  /**
   * The time-to-live of the cache in ms.
   * @readonly
   * @default Infinity
   */
  public readonly ttl: number = Infinity;
  /**
   * The caching strategy to use.
   * @readonly
   * @default Strategy.NetworkFirst
   */
  public readonly strategy: Strategy = Strategy.NetworkFirst;
  private readonly maxItems: number = 100;

  /**
   * Create a new `RemixCache` instance. Don't invoke this directly! Use `initCache` instead.
   * @constructor
   * @param {object} options - Options for the RemixCache instance.
   */
  constructor(options: RemixCacheOptions) {
    this.name = options.name;
    this.maxItems = options.maxItems || 100;
    this.strategy = options.strategy || Strategy.NetworkFirst;
    this.ttl = options.ttl || Infinity;

    if (this.strategy === Strategy.NetworkOnly) {
      this.ttl = -1;
    }
  }

  private async _openCache() {
    return await caches.open(this.name);
  }

  private async _maintainCache(): Promise<void> {
    const cache = await this._openCache();
    const keysResponse = await cache.keys();
    const validKeys: any[] = [];
    const now = Date.now();

    for (const request of keysResponse) {
      const response = await cache.match(request);
      if (response) {
        const expiresAtHeader = response.headers.get('x-cache-expires-at')!;
        const expiresAt = parseInt(expiresAtHeader, 10);
        if (!expiresAt || expiresAt > now) {
          validKeys.push({
            key: request.url,
            accessedAt: parseInt(response.headers.get('x-cache-accessed-at')!, 10) || 0,
          });
        } else {
          await cache.delete(request);
        }
      }
    }

    // Sort valid keys by access time (LRU)
    validKeys.sort((a, b) => a.accessedAt - b.accessedAt);

    // Remove least recently used items if cache size exceeds maxItems
    if (validKeys.length > this.maxItems) {
      const keysToRemove = validKeys.slice(0, validKeys.length - this.maxItems);
      for (const keyToRemove of keysToRemove) {
        await cache.delete(keyToRemove.key);
      }
    }
  }

  private _updateHeaders(response: Response, headersToUpdate: Record<string, string>) {
    const headers = new Headers(response.headers);
    for (const [headerName, headerValue] of Object.entries(headersToUpdate)) {
      headers.set(headerName, headerValue);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  /**
   * Delete an entry from the cache.
   * Takes in the same parameters as `Cache.delete`.
   * @param {RequestInfo | URL} request - The request to delete.
   * @param {CacheQueryOptions} [options] - Options for the delete operation.
   * @returns {Promise<boolean>} Returns `true` if an entry was deleted, otherwise `false`.
   *
   * @example
   * ```js
   * const cache = await initCache({ name: 'my-cache' });
   *
   * await cache.put('/hello-world', new Response('Hello World!'));
   * await cache.delete('/hello-world');
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete
   */
  async delete(request: RequestInfo | URL, options?: CacheQueryOptions | undefined): Promise<boolean> {
    return this._openCache().then(cache => cache.delete(request, options));
  }

  /**
   * Returns a Promise that resolves to the length of the Cache object.
   *
   * @returns {Promise<number>} The number of entries in the cache.
   */
  async length(): Promise<number> {
    const keys = await this.keys();
    return keys.length;
  }

  /**
   * Returns a `Promise` that resolves to an array of Cache keys.
   *
   * @returns {Promise<readonly Request[]>} An array of Cache keys.
   */
  async keys(): Promise<readonly Request[]> {
    const cache = await this._openCache();
    return await cache.keys();
  }

  /**
   * Return a `Promise` that resolves to an entry in the cache object. Accepts the
   * same parameters as `Cache.match`.
   *
   * @param {RequestInfo | URL} request - The request to match.
   * @param {CacheQueryOptions} [options] - Options for the match operation.
   *
   * @returns {Promise<Response | undefined>} A `Promise` that resolves to the response, or `undefined` if not found.
   */
  async match(request: RequestInfo | URL, options?: CacheQueryOptions | undefined): Promise<Response | undefined> {
    const cache = await caches.open(this.name);

    const response = await cache.match(request, options);
    if (!response) {
      return undefined;
    }

    const now = Date.now();
    const res = this._updateHeaders(response, {
      'x-cache-accessed-at': now.toString(),
    });

    await cache.put(request, res);
    return res;
  }

  /**
   * Add an entry to the cache.
   * Takes in the same parameters as `Cache.put`.
   *
   * @param {RequestInfo | URL} request - The request to add.
   * @param {Response} response - The response to add.
   * @returns {Promise<void>} A `Promise` that resolves when the entry is added to the cache.
   *
   * @example
   * ```js
   * const cache = await initCache({ name: 'my-cache' });
   *
   * await cache.put('/hello-world', new Response('Hello World!'));
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Cache/put
   */
  async put(request: RequestInfo | URL, response: Response, ttl: number = this.ttl): Promise<void> {
    const cache = await this._openCache();

    // If ttl is negative, don't cache
    if (this.ttl < 0) return;

    const now = Date.now();
    const expiresAt = now + ttl;
    const headersToUpdate = {
      'x-cache-accessed-at': now.toString(),
      'x-cache-expires-at': expiresAt.toString(),
    };

    // Update headers and clone response with updated headers
    const updatedResponse = this._updateHeaders(response, headersToUpdate);

    // Cache the updated response and maintain the cache
    try {
      await cache.put(request, updatedResponse);
      await this._maintainCache();
    } catch (error) {
      console.error('Failed to put to cache:', error);
    }
  }
}
