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
  private static _instances: RemixCache[] = [];

  // eslint-disable-next-line no-useless-constructor
  private constructor() {}

  /**
   * Initialize the Remix PWA Cache Storage. This will create a special cache for each
   * existing cache in the browser or create a new map if none exist.
   *
   * Use in your service worker installation script.
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
  static async init() {
    if (typeof caches === 'undefined') {
      throw new Error('Cache API is not available in this environment.');
    }

    if (this._instances.length) {
      return;
    }

    const cachesNames = await caches.keys();
    for (const name of cachesNames) {
      this._instances.push(new RemixCache({ name }));
    }
  }

  /**
   * Create a custom cache that you can use across your application.
   * Use this instead of initialising `RemixCache` directly.
   */
  static createCache(opts: RemixCacheOptions) {
    const newCache = new RemixCache(opts);
    this._instances.push(newCache);
    return newCache;
  }

  /**
   * Check wether a cache with the given name exists.
   *
   * @param name
   */
  static has(name: string) {
    return this._instances.some(cache => cache.name === name);
  }

  /**
   * Get a cache by name.
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
  static get(name: string) {
    return this._instances.find(cache => cache.name === name);
  }

  /**
   * Delete a cache by name.
   *
   * @param name
   */
  static delete(name: string) {
    const cache = this._instances.find(cache => cache.name === name);
    if (cache) {
      caches.delete(name);
      this._instances = this._instances.filter(cache => cache.name !== name);
    }
  }

  /**
   * Delete all caches.
   */
  static clear() {
    this._instances.forEach(cache => caches.delete(cache.name));
    this._instances = [];
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
    return this._instances.length;
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
