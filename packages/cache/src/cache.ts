import { base64ToUint8Array, uint8ArrayToString } from 'uint8array-extras';

import { mergeHeaders, omit } from './utils.js';

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

interface CustomCache extends Omit<Cache, 'addAll' | 'matchAll'> {
  put(request: RequestInfo | URL, response: Response, ttl?: number | undefined): Promise<void>;
}

type Metadata = {
  accessedAt: number;
  expiresAt: number;
  cacheTtl: number;
  cacheMaxItems: number;
  cacheStrategy: Strategy;
};

type ResponseBody = {
  value: unknown | string;
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
  private _ttl = Infinity;
  /**
   * The caching strategy to use. Intended to provide strategies with cachified.
   * @readonly
   * @default Strategy.NetworkFirst
   */
  private _strategy: Strategy = Strategy.NetworkFirst;
  private _maxItems = 100;

  private set = false;

  /**
   * Create a new `RemixCache` instance. Don't invoke this directly! Use `RemixCacheStorage.open()` instead.
   * @constructor
   * @param {object} options - Options for the RemixCache instance.
   */
  constructor(options: RemixCacheOptions) {
    this.name = options.name;
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
    } else {
      this.set = false;
    }
  }

  private async _openCache() {
    return await caches.open(`rp-${this.name}`);
  }

  private async _getOrDeleteIfExpired(key: Request, metadata: Metadata) {
    // @ts-ignore
    if (metadata.expiresAt === 'Infinity') {
      return false;
    }

    if (Number(metadata.expiresAt) <= Date.now()) {
      return await this.delete(key);
    }

    return false;
  }

  private async _lruCleanup() {
    const isOverflowing = (await this.length()) >= this._maxItems;

    if (isOverflowing) {
      const cache = await this._openCache();
      const keys = await cache.keys();
      const values = (await Promise.all(keys.map(key => cache.match(key)))) as Response[];

      const keyVal = keys.map((key, i) => ({ key, val: values[i] }));

      const comparableArrayPromise = keyVal.map(async val => {
        const { metadata }: ResponseBody = await val.val.clone().json();

        return {
          metadata,
          url: val.key.url,
        };
      });

      const comparableArray = await Promise.all(comparableArrayPromise);

      const sortedArr = comparableArray.sort((a, b) => {
        return Number(a.metadata.accessedAt) - Number(b.metadata.accessedAt);
      });

      const toBeDeletdItems = sortedArr.slice(0, sortedArr.length - this._maxItems + 1);

      for (const deleted of toBeDeletdItems) {
        // This runs everytime a new entry is added so that means the array maximum size can never
        // exceed `maxItems + 1` (the new entry + the maxItems), so we can safely slice the array
        // to the maxItems length starting from the first index.
        await this.delete(deleted.url);
      }
    }
  }

  private async _getResponseValue(request: Request, response: Response): Promise<Response | undefined> {
    const { metadata, value }: ResponseBody = await response.clone().json();

    const deleted = await this._getOrDeleteIfExpired(request, metadata);
    const headers = new Headers(response.clone().headers);

    // Temporary. Need to come up with a method to restore `RemixCache` from the browser's
    // cache storage ASAP. This is a (*hic*) temporary fix to ensure that the cache is always up to date
    if (!this.set) {
      this.set = true;
      this._ttl = metadata.cacheTtl;
      this._maxItems = metadata.cacheMaxItems;
      this._strategy = metadata.cacheStrategy;
    }

    const newHeader = new Headers(headers);
    newHeader.set('X-Remix-PWA-TTL', metadata.expiresAt.toString());
    newHeader.set('X-Remix-PWA-AccessTime', Date.now().toString());
    newHeader.set('Content-Type', headers.get('X-Remix-PWA-Original-Content-Type') || 'application/json');

    const contentType = headers.get('X-Remix-PWA-Original-Content-Type') ?? '';

    newHeader.delete('X-Remix-PWA-Original-Content-Type');

    const responseOptions = {
      status: response.status,
      statusText: response.statusText,
      headers: newHeader,
      body: 'null' as any,
    };

    if (contentType.includes('application/json')) {
      // JSON response
      responseOptions.body = JSON.stringify(value as string);
    } else if (contentType.includes('text')) {
      // Text response
      responseOptions.body = value as string;
    } else {
      // Binary or other response types
      responseOptions.body = base64ToUint8Array(value as string);
    }

    if (!deleted) {
      const res = new Response(
        responseOptions.body as unknown as BodyInit,
        omit('body', responseOptions) as ResponseInit
      );

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
    const cache = await this._openCache();
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

    if (response === null || response.status === 204 || response.statusText.toLowerCase() === 'no content') {
      // If the response/response body is null, delete the entry (if found)
      // and don't cache.
      await this.delete(request);
      return;
    }

    const contentType = response.headers.get('Content-Type');

    let data;

    if (contentType && contentType.includes('application/json')) {
      // If the response is JSON, parse it
      data = await response.clone().json();
    } else if (contentType && contentType.includes('text')) {
      // If the response is not JSON, treat it as text
      data = await response.clone().text();
    } else {
      const buffer = await response.clone().arrayBuffer();
      data = uint8ArrayToString(new Uint8Array(buffer));
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
      } else {
        this._ttl = Infinity;
        this._maxItems = 100;
        this._strategy = Strategy.NetworkFirst;
      }
    }

    const resHeaders = response.headers;
    const expiresAt = resHeaders.get('X-Remix-PWA-TTL') || Date.now() + (ttl ?? this._ttl);
    const accessedAt = resHeaders.get('X-Remix-PWA-AccessTime') || Date.now().toString();

    const newHeaders = new Headers();
    newHeaders.set('Content-Type', 'application/json');
    newHeaders.set('X-Remix-PWA-AccessTime', accessedAt);
    newHeaders.set('X-Remix-PWA-Original-Content-Type', contentType || 'text/plain');
    newHeaders.set('X-Remix-PWA-TTL', expiresAt.toString());

    const toBeCachedRes = new Response(
      JSON.stringify({
        metadata: {
          accessedAt,
          // JSON can't store `Infinity`, so we store it as a string
          expiresAt: expiresAt.toString(),
          cacheTtl: this._ttl.toString(),
          cacheMaxItems: this._maxItems,
          cacheStrategy: this._strategy,
        },
        value: data,
      }),
      {
        status: response.status,
        statusText: response.statusText,
        headers: mergeHeaders(resHeaders, newHeaders),
      }
    );

    Object.defineProperty(toBeCachedRes, 'url', { value: response.url });
    Object.defineProperty(toBeCachedRes, 'type', { value: response.type });
    Object.defineProperty(toBeCachedRes, 'ok', { value: response.ok });
    Object.defineProperty(toBeCachedRes, 'redirected', { value: response.redirected });

    // Cache the updated response and maintain the cache
    try {
      await this._lruCleanup();
      return await cache.put(request, toBeCachedRes.clone());
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Failed to put to cache:', error);
    }
  }

  async add(request: RequestInfo | URL): Promise<void> {
    return /* await - should this be awaited? */ fetch(request).then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch');
      }

      return this.put(request, res.clone());
    });
  }

  get ttl() {
    return this._ttl;
  }

  get strategy() {
    return this._strategy;
  }

  // get maxItems() {}
}
