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
  put(request: RequestInfo | URL, response: Response, ttl?: number | undefined, modified?: boolean): Promise<void>;
}

type Metadata = {
  accessedAt: number;
  expiresAt: number;
  cacheTtl: number;
  cacheMaxItems: number;
  cacheStrategy: Strategy;
};

type ResponseBody = {
  value: any;
  metadata: Metadata;
};

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
  /**
   * Whether to use strict mode or not. By strict mode, we mean that the cache will **only**
   * return data if valid. If for example, the cache is expired, it will return `undefined` instead
   * of returning it then nullifying it (non-strict mode)
   */
  // strict?: boolean;
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
  private _ttl: number = Infinity;
  /**
   * The caching strategy to use. Intended to provide strategies with cachified.
   * @readonly
   * @default Strategy.NetworkFirst
   */
  private _strategy: Strategy = Strategy.NetworkFirst;
  private _maxItems: number = 100;

  private set = false;

  /**
   * Create a new `RemixCache` instance. Don't invoke this directly! Use `RemixCacheStorage.open()` instead.
   * @constructor
   * @param {object} options - Options for the RemixCache instance.
   */
  constructor(options: RemixCacheOptions) {
    this.name = 'rp-' + options.name;
    this._maxItems = options.maxItems || 100;
    this._strategy = options.strategy || Strategy.NetworkFirst;
    this._ttl = options.ttl || Infinity;

    if (this._strategy === Strategy.NetworkOnly) {
      // Don't use the cache at all
      this._ttl = -1;
    }

    // If it is user initiated, set the cache
    if (options.maxItems || options.ttl || options.strategy) {
      this.set = true;
    }
  }

  private async _openCache() {
    return await caches.open(`${this.name}`);
  }

  private async _getOrDeleteIfExpired(key: Request, metadata: Metadata) {
    if (metadata.expiresAt <= Date.now()) {
      return await this.delete(key);
    }

    return false;
  }

  private async _values() {
    const cache = await this._openCache();
    const keys = await cache.keys();
    return (await Promise.all(keys.map(key => cache.match(key)))) as Response[];
  }

  private async _lruCleanup() {
    if ((await this.length()) >= this._maxItems) {
      this._values().then(async values => {
        const val = values.sort((a, b) => {
          // @ts-ignore
          const aMeta = a.clone().json().metadata;
          //  @ts-ignore
          const bMeta = b.clone().json().metadata;

          return aMeta.accessedAt - bMeta.accessedAt;
        })[0];
        // This runs everytime a new entry is added so that means the array maximum size can never
        // exceed `maxItems + 1` (the new entry + the maxItems), so we can safely slice the array
        // to the maxItems length starting from the first index.
        this.delete(val.url);
      });
    }
  }

  private async _getResponseValue(request: Request, response: Response): Promise<Response | undefined> {
    const { metadata, value }: ResponseBody = await response.clone().json();

    const deleted = await this._getOrDeleteIfExpired(request.clone(), metadata);
    const headers = new Headers(response.clone().headers);

    // Temporary. Need to come up with a method to restore `RemixCache` from the browser's
    // cache storage ASAP. This is a (*hic*) temporary fix to ensure that the cache is always up to date
    if (!this.set) {
      this.set = true;
      this._ttl = metadata.cacheTtl;
      this._maxItems = metadata.cacheMaxItems;
      this._strategy = metadata.cacheStrategy;
    }

    if (!deleted) {
      const res = new Response(value, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(headers.entries()),
          'Content-Type': headers.get('x-remix-pwa-original-content-type') || 'application/json',
        },
      });

      await this.put(request, res.clone(), undefined);

      return res;
    }

    return undefined;
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
    if (request instanceof URL || typeof request === 'string') {
      request = new Request(request);
    }

    const response = await cache.match(request.clone(), options);

    if (!response) {
      return undefined;
    }

    return await this._getResponseValue(request, response.clone());
  }

  /**
   * Add an entry to the cache.
   * Takes in the same parameters as `Cache.put`.
   *
   * @param {RequestInfo | URL} request - The request to add.
   * @param {Response} response - The response to add.
   * @param {number | undefined} ttl - The time-to-live of the cache entry in ms. Defaults to cache ttl.
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
  async put(request: RequestInfo | URL, response: Response, ttl: number | undefined = undefined): Promise<void> {
    const cache = await this._openCache();
    if (request instanceof URL || typeof request === 'string') {
      request = new Request(request);
    }

    // If ttl is negative, don't cache
    if (this._ttl <= 0 || (ttl && ttl <= 0)) return;

    const contentType = response.headers.get('Content-Type');

    let data;
    if (contentType && contentType.includes('application/json')) {
      // If the response is JSON, parse it
      data = await response.clone().json();
    } else {
      // If the response is not JSON, treat it as text
      data = await response.clone().text();
    }

    // Temporary. Actually slows this process down by an average of 2ms. Not good enough.
    if (!this.set) {
      this.set = true;

      const keys = await cache.keys();
      const firstVal = await cache.match(keys[0]);

      if (firstVal) {
        const { metadata }: ResponseBody = await firstVal.clone().json();
        this._ttl = metadata.cacheTtl;
        this._maxItems = metadata.cacheMaxItems;
        this._strategy = metadata.cacheStrategy;
      }
    }

    response = new Response(
      JSON.stringify({
        metadata: {
          accessedAt: Date.now(),
          expiresAt: Date.now() + (ttl ?? this._ttl),
          cacheTtl: this._ttl,
          cacheMaxItems: this._maxItems,
          cacheStrategy: this._strategy,
        },
        value: data,
      }),
      {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.clone().headers.entries()),
          'Content-Type': 'application/json',
          'x-remix-pwa-original-content-type': contentType || 'text/plain',
        },
      }
    );

    // Cache the updated response and maintain the cache
    try {
      await this._lruCleanup();
      return await cache.put(request, response.clone());
    } catch (error) {
      console.error('Failed to put to cache:', error);
    }
  }

  get ttl() {
    return this._ttl;
  }

  get strategy() {
    return this._strategy;
  }

  // get maxItems() {}
}
