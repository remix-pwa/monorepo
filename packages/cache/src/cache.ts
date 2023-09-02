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
  public readonly ttl: number = Infinity;
  /**
   * The caching strategy to use. Intended to provide strategies with cachified.
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
      // Don't use the cache at all
      this.ttl = -1;
    }
  }

  private async _openCache() {
    return await caches.open(this.name);
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
    if ((await this.length()) >= this.maxItems) {
      this._values().then(async values => {
        values
          .sort((a, b) => {
            // @ts-ignore
            const aMeta = a.clone().json().metadata;
            //  @ts-ignore
            const bMeta = b.clone().json().metadata;

            return aMeta.accessedAt - bMeta.accessedAt;
          })
          // This runs everytime a new entry is added so that means the array maximum size can never
          // exceed `maxItems + 1` (the new entry + the maxItems), so we can safely slice the array
          // to the maxItems length starting from the first index.
          .slice(1);
      });
    }
  }

  private async _getResponseValue(request: Request, response: Response) {
    const { metadata, value }: ResponseBody = await response.clone().json();

    const deleted = await this._getOrDeleteIfExpired(request.clone(), metadata);

    if (!deleted) {
      const res = new Response(
        JSON.stringify({
          metadata: {
            ...metadata,
            accessedAt: Date.now(),
          },
          value,
        }),
        {
          status: response.status,
          statusText: response.statusText,
          headers: {
            ...Object.fromEntries(response.clone().headers.entries()),
            'Content-Type': 'application/json',
          },
        }
      );

      await this.put(request, res.clone(), undefined, true);
      return res
        .clone()
        .json()
        .then(({ value }) => value);
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
   * @param {boolean} modified - Whether the response has been modified.
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
  async put(
    request: RequestInfo | URL,
    response: Response,
    ttl: number | undefined = undefined,
    modified: boolean = false
  ): Promise<void> {
    const cache = await this._openCache();
    if (request instanceof URL || typeof request === 'string') {
      request = new Request(request);
    }

    // If ttl is negative, don't cache
    if (this.ttl <= 0 || (ttl && ttl <= 0)) return;

    if (!modified) {
      response = new Response(
        JSON.stringify({
          metadata: {
            accessedAt: Date.now(),
            expiresAt: Date.now() + (ttl ?? this.ttl),
          },
          value: await response.clone().json(),
        }),
        {
          status: response.status,
          statusText: response.statusText,
          headers: {
            ...Object.fromEntries(response.clone().headers.entries()),
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Cache the updated response and maintain the cache
    try {
      await this._lruCleanup();
      return await cache.put(request, response.clone());
    } catch (error) {
      console.error('Failed to put to cache:', error);
    }
  }
}
