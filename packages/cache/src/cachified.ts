import type { CreateReporter, GetFreshValue } from 'cachified';
import cachified from 'cachified';

import { remixCacheAdapter } from './adapter.js';
import { Strategy, type RemixCache } from './cache.js';

export type CachifiedWrapperOptions = {
  /**
   * Required
   *
   * The key this value is cached by
   * Must be unique for each value
   */
  key: string;
  /**
   * Required
   *
   * Cache store to use.
   */
  cache: RemixCache;
  getFreshValue: GetFreshValue<any>;
  /**
   * Amount of milliseconds that a value with exceeded ttl is still returned
   * while a fresh value is refreshed in the background
   *
   * Should be positive, can be infinite. Only valid when `strategy` is set to
   * `Strategy.StaleWhileRevalidate`
   *
   * Default: `0`
   */
  swr?: number;
  /**
   * Time To Live; often also referred to as max age
   *
   * Amount of milliseconds the value should stay in cache
   * before we get a fresh one. This value would override the
   * `ttl` value of the cache itself for this entry.
   *
   * Setting any negative value will disable caching.
   * Can be infinite
   *
   * Default: `Infinity` (no expiration)
   */
  ttl?: number;
  /**
   * Amount of time in milliseconds before revalidation of a stale
   * cache entry is started
   *
   * Must be positive and finite
   *
   * Default: `0`
   */
  staleRefreshTimeout?: number;
  /**
   * A reporter receives events during the runtime of
   * cachified and can be used for debugging and monitoring
   *
   * Default: `undefined` - no reporting
   */
  reporter?: CreateReporter<any>;
};

/**
 * A Remix PWA cache wrapper for cachified. It transforms `RemixCache` into
 * a cachified compatible cache with strategy support. For more information
 * about cachified, see [cachified docs](https://github.com/Xiphe/cachified/blob/main/readme.md)
 *
 * @param opts Options for cachified
 * @returns A cachified function
 */
export const cachifiedWrapper = (opts: CachifiedWrapperOptions) => {
  const { cache, getFreshValue, key, reporter, staleRefreshTimeout, swr, ttl } = opts;
  const strategy = cache.strategy;
  const finalTtl = ttl ?? cache.ttl;

  return cachified.cachified({
    key,
    cache: remixCacheAdapter(opts.cache),
    getFreshValue: strategy !== Strategy.CacheOnly ? getFreshValue : () => undefined,
    ttl: strategy !== Strategy.NetworkOnly ? finalTtl : -1,
    fallbackToCache: strategy !== Strategy.NetworkOnly,
    forceFresh: strategy === Strategy.NetworkOnly || strategy === Strategy.NetworkFirst,
    swr: strategy === Strategy.StaleWhileRevalidate ? swr : 0,
    staleRefreshTimeout,
    reporter,
  });
};
