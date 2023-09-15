import type { RemixCacheOptions } from './cache.js';
import { RemixCache } from './cache.js';

/**
 * Remix Cache Storage
 *
 * This is a wrapper around the Cache Storage API that allows you to create and manage
 * multiple caches. It also provides a way to check if a request is stored in any of the
 * caches.
 *
 * It is used hand-in-hand with `RemixCache`, a lightweight wrapper around the Cache API that provides
 * a simple interface to store and retrieve data from the cache as well as extra functionalities including
 * cache expiration and cache versioning.
 *
 * This is a static class! You don't need to (_can't_) instantiate it.
 *
 * @alias `Storage`
 *
 * @example
 * ```js
 * import { Storage } from '@remix-run/cache';
 *
 * // Initialize the storage
 * await Storage.init();
 * ```
 */
export class RemixCacheStorage {
  private static _instances: Map<string, RemixCache> = new Map<string, RemixCache>();

  // eslint-disable-next-line no-useless-constructor
  private constructor() {}

  /**
   * Initialize the Remix PWA Cache Storage. This will create a special cache for each
   * existing cache in the browser or create a new map if none exist.
   *
   * Use in your service worker installation script. Make sure to call this before
   * initializing any `RemixCache` instance.
   *
   * @example
   * ```js
   * import { RemixCacheStorage } from '@remix-run/cache';
   *
   * self.addEventListener('install', (event) => {
   *  event.waitUntil(Promise.all[
   *   RemixCacheStorage.init(),
   *   // other stuff
   *  ]);
   * });
   * ```
   */
  // static async init() {
  //   if (typeof caches === 'undefined') {
  //     throw new Error('Cache API is not available in this environment.');
  //   }

  //   if (this._instances.size > 0) {
  //     return;
  //   }

  //   const cachesNames = await caches.keys();

  //   for (const name of cachesNames) {
  //     if (name.startsWith('rp-')) {
  //       this._instances.set(name, new RemixCache({ name }));
  //     }
  //   }
  // }

  /**
   * Create a custom cache that you can use across your application.
   * Use this instead of initialising `RemixCache` directly.
   */
  static createCache(opts: RemixCacheOptions) {
    const { name } = opts;

    if (this._instances.has(name)) {
      // throw new Error(`A cache with the name '${name}' already exists.`);
      return this._instances.get(name) as RemixCache;
    }

    const newCache = new RemixCache(opts);
    this._instances.set(`${name}`, newCache);
    return newCache;
  }

  /**
   * Check wether a cache with the given name exists.
   *
   * @param name
   */
  static has(name: string) {
    return this._instances.has(name);
  }

  /**
   * Get a cache by name. Returns `undefined` if no cache with the given name exists.
   * Use `has` to check if a cache exists. Or `open` to create one automatically if non exists.
   *
   * @param name
   * @returns {RemixCache | undefined}
   *
   * @example
   * ```js
   * import { Storage } from '@remix-run/cache';
   *
   * const cache = Storage.get('my-cache');
   * ```
   */
  static get(name: string): RemixCache | undefined {
    return this._instances.get(name);
  }

  /**
   * Get a cache by name. If no cache with the given name exists, create one.
   *
   * @param name Name of the cache - **must be unique**
   * @param opts Options to pass to the `RemixCache` constructor if the cache is getting created
   * @returns {RemixCache}
   *
   * @example
   * ```js
   * import { Storage } from '@remix-run/cache';
   *
   * const cache = Storage.open('my-cache');
   * ```
   */
  static open(name: string, opts?: Omit<RemixCacheOptions, 'name'>): RemixCache {
    const cache = this._instances.get(name);

    if (!cache) {
      return this.createCache({ name, ...opts });
    }

    return cache;
  }

  /**
   * Delete a cache by name.
   *
   * @param name
   */
  static delete(name: string) {
    const cache = this._instances.get(name);

    if (cache) {
      caches.delete(name);
      this._instances.delete(name);
    }
  }

  /**
   * Delete all caches.
   */
  static clear() {
    this._instances.forEach(cache => caches.delete(cache.name));
    this._instances = new Map();
  }

  /**
   * Get all caches. **Don't use this except you know what you are doing!**
   *
   * Which, frankly speaking, you probably don't. So shoo away!
   */
  static get instances() {
    return this._instances;
  }

  /**
   * Get the number of caches.
   *
   * Return the length of the `RemixCacheStorage` store.
   */
  static get _length() {
    return this._instances.size;
  }

  /**
   * Check if a request is stored as the key of a response in all caches.
   *
   * Experimental. Use at your own risk!
   *
   * @param {RequestInfo | URL} request
   */
  static _match(request: RequestInfo | URL) {
    return caches.match(request);
  }
}

/**
 * @alias `RemixCacheStorage`
 */
export const Storage = RemixCacheStorage;

/**
 * Short-hand for `Storage.createCache()`.
 */
export const initCache = (options: RemixCacheOptions): RemixCache => {
  return Storage.createCache(options);
};

/**
 * @alias `initCache`
 */
export const createCache = initCache;

declare global {
  interface WorkerGlobalScope {
    /**
     * Remix Cache Storage
     *
     * This is a wrapper around the Cache Storage API that allows you to create and manage
     * multiple caches (`RemixCache`). It also provides interfaces to interact with the caches.
     *
     * Recommended to call `init` in your service worker installation or activation script in order to
     * wrap all existing caches in `RemixCache` instances and supercharge them. Defaults to `undefined`.
     *
     * @alias `Storage`
     */
    RemixCacheStorage: typeof RemixCacheStorage;
  }

  interface Window {
    /**
     * Remix Cache Storage
     *
     * This is a wrapper around the Cache Storage API that allows you to create and manage
     * multiple caches (`RemixCache`). It also provides interfaces to interact with the caches.
     *
     * Recommended to call `init` in your service worker installation or activation script in order to
     * wrap all existing caches in `RemixCache` instances and supercharge them. Defaults to `undefined`.
     *
     * @alias `Storage`
     */
    RemixCacheStorage: typeof RemixCacheStorage;
  }
}
