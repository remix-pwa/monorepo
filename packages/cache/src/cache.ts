export enum Strategy {
  CacheFirst = 'cache-first',
  NetworkFirst = 'network-first',
  CacheOnly = 'cache-only',
  NetworkOnly = 'network-only',
  StaleWhileRevalidate = 'stale-while-revalidate',
}

interface CustomCache extends Omit<Cache, 'add' | 'addAll' | 'matchAll'> {
  put(request: RequestInfo | URL, response: Response, ttl?: number): Promise<void>;
}

export type RemixCacheOptions = {
  /**
   * The name of the cache. Ensure this is unique for each cache.
   * @requird
   */
  name: string;
  /**
   * The caching strategy to use.
   * @required
   */
  // strategy: Strategy;
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
  public readonly name: string;
  private readonly maxItems: number = 100;
  private readonly ttl: number = Infinity;

  /**
   * Create a new `RemixCache` instance. Don't invoke this directly! Use `initCache` instead.
   * @constructor
   * @param {object} options - Options for the RemixCache instance.
   */
  constructor(options: RemixCacheOptions) {
    this.name = options.name;
    this.maxItems = options.maxItems || 100;
    this.ttl = options.ttl || Infinity;
  }

  private async _openCache() {
    return await caches.open(this.name);
  }

  private async _maintainCache(): Promise<void> {
    const cache = await this._openCache();
    const keysResponse = await cache.keys();
    const validKeys = [];
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

  async delete(request: RequestInfo | URL, options?: CacheQueryOptions | undefined): Promise<boolean> {
    return this._openCache().then(cache => cache.delete(request, options));
  }

  async length(): Promise<number> {
    const keys = await this.keys();
    return keys.length;
  }

  async keys(): Promise<readonly Request[]> {
    const cache = await this._openCache();
    return await cache.keys();
  }

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

  async put(request: RequestInfo | URL, response: Response, ttl: number = this.ttl): Promise<void> {
    const cache = await this._openCache();

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
