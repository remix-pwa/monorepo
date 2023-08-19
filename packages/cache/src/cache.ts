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
  // private readonly strategy: Strategy;
  private readonly maxItems: number = 100;
  private readonly ttl: number = Infinity;

  /**
   * Create a new `RemixCache` instance.
   * @constructor
   * @param {object} options - Options for the RemixCache instance.
   */
  constructor(options: RemixCacheOptions) {
    this.name = options.name;
    this.maxItems = options.maxItems || 100;
    this.ttl = options.ttl || Infinity;
  }

  private async _maintainCache(): Promise<void> {
    const cache = await caches.open(this.name);
    const keysResponse = await cache.keys();
    const keys = keysResponse.map(request => request.url);

    // Fetch access time headers for all items
    const accessTimestamps = await Promise.all(
      keys.map(async key => {
        const response = await cache.match(key);
        if (response) {
          const accessedAtHeader = response.headers.get('x-cache-accessed-at') || '';
          const accessedAt = parseInt(accessedAtHeader, 10);
          return { key, accessedAt };
        }
      })
    );

    const sortedKeys = accessTimestamps.sort((a, b) => a!.accessedAt - b!.accessedAt).map(item => item!.key);

    if (sortedKeys.length > this.maxItems) {
      const itemsToRemove = sortedKeys.slice(0, sortedKeys.length - this.maxItems);
      for (const keyToRemove of itemsToRemove) {
        await cache.delete(keyToRemove);
      }
    }

    for (const key of keys) {
      const response = await cache.match(key);
      if (response) {
        const expiresAtHeader = response.headers.get('x-cache-expires-at') || '';
        const expiresAt = parseInt(expiresAtHeader, 10);
        if (expiresAt && Date.now() >= expiresAt) {
          await cache.delete(key);
        }
      }
    }
  }

  async delete(request: RequestInfo | URL, options?: CacheQueryOptions | undefined): Promise<boolean> {
    const cache = await caches.open(this.name);

    if (typeof request === 'string') {
      request = new Request(request);
    }

    return cache.delete(request, options);
  }

  async keys(
    request?: RequestInfo | URL | undefined,
    options?: CacheQueryOptions | undefined
  ): Promise<readonly Request[]> {
    const cache = await caches.open(this.name);

    if (typeof request === 'string') {
      request = new Request(request);
    }

    return cache.keys(request, options);
  }

  async match(request: RequestInfo | URL, options?: CacheQueryOptions | undefined): Promise<Response | undefined> {
    const cache = await caches.open(this.name);

    const response = await cache.match(request, options);
    if (!response) {
      return undefined;
    }

    const item = JSON.parse(await response.text());

    if (item.expiresAt && Date.now() >= item.expiresAt) {
      await cache.delete(request);
      return undefined;
    }

    item.accessedAt = Date.now();
    await cache.put(request, new Response(JSON.stringify(item)));
    this._maintainCache();

    return item.value;
  }

  async put(request: RequestInfo | URL, response: Response, ttl: number = this.ttl, start?: number): Promise<void> {
    const cache = await caches.open(this.name);

    const responseBody = await response.clone().text();
    const item = {
      response: {
        status: response.status,
        statusText: response.statusText,
        headers: { ...response.headers },
        body: responseBody,
      },
      expiresAt: ttl ?? Date.now() + ttl,
      accessedAt: start ?? Date.now(),
    };

    if (typeof request === 'string') {
      request = new Request(request);
    }

    await cache.put(request, new Response(JSON.stringify(item)));
    await this._maintainCache();
  }
}
