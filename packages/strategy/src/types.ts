import type { RemixCache, RemixCacheOptions } from '@remix-pwa/cache';

export interface StrategyOptions {
  /**
   * The name of the cache to utilise. Could also be a `RemixCache` instance.
   */
  cache: string | RemixCache;
  /**
   * The options to pass to create the cache with if it doesn't exist.
   */
  cacheOptions?: Omit<RemixCacheOptions, 'name'>;
}

export type StrategyResponse = (request: Request) => Promise<Response>;
