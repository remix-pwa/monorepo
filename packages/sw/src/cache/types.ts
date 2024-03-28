/**
 * Defines the options for cache strategies.
 */
export interface CacheOptions {
  maxAgeSeconds?: number;
  maxEntries?: number;
}

export type CacheableResponseOptions = {
  statuses?: number[];
  headers?: Record<string, string>;
};

/**
 * ...
 *
 * If you have a better name for this 🤷‍♂️, feel free to open a PR!
 */
export interface CacheFriendlyOptions extends CacheOptions {
  cacheableResponse?: CacheableResponseOptions | false;
}

/**
 * ...
 *
 * If you have a better name for this 🤷‍♂️, feel free to open a PR!
 */
export interface NetworkFriendlyOptions extends CacheOptions {
  networkTimeoutInSeconds?: number;
  cacheableResponse?: CacheableResponseOptions | false;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SWROptions extends CacheOptions {
  // ttl?: number;
  // notifyUpdates?: boolean;
}

/**
 * Defines the structure of a cache strategy.
 */
export interface CacheStrategy {
  handleRequest(request: Request): Promise<Response>;
}

// --- EnhancedCache ---

export type StrategyName = 'CacheFirst' | 'CacheOnly' | 'NetworkFirst' | 'StaleWhileRevalidate';

export type StrategySelection<T> = T extends 'NetworkFirst'
  ? NetworkFriendlyOptions
  : T extends 'StaleWhileRevalidate'
    ? SWROptions
    : CacheFriendlyOptions;

// Define discriminated unions for each strategy
type StrategyWithOptions<T extends StrategyName> = {
  strategy: T;
  strategyOptions: StrategySelection<T>;
};

export type EnhancedCacheOptions = {
  version?: string;
} & (
  | {
      strategy?: never;
      strategyOptions?: never;
    }
  | StrategyWithOptions<'CacheFirst'>
  | StrategyWithOptions<'CacheOnly'>
  | StrategyWithOptions<'NetworkFirst'>
  | StrategyWithOptions<'StaleWhileRevalidate'>
);

export type CacheStats = {
  /**
   * The total number of items in the cache.
   */
  length: number;
  /**
   * The total size of items in the cache (in kilobytes)
   */
  totalSize: number;
  /**
   * The distribution of cache items by content type (in percentages).
   *
   * This metric can help you understand which types of resources
   * are being cached more effectively or require optimizations.
   */
  cacheDistribution: Record<string, number>;
  /**
   * The hit ratio of the cache. The ratio of cache hits to total requests.
   *
   * This metric can help you understand how effectively the cache is serving
   * resources without needing to fetch from the network.
   */
  cacheHitRatio: number;
  /**
   * The efficiency of the cache. The ratio of cache
   * hits to the total size of the cache (in percentage).
   *
   * This metric can help you understand how efficiently the cache is being utilized.
   */
  cacheEfficiency: number;
  /**
   * The average age of items in the cache (in seconds).
   */
  averageCacheAge: number;
  /**
   * The ratio of the total size of compressed cached resources to the
   * total size of uncompressed cached resources (in percentage).
   *
   * This metric can help you understand the effectiveness of cache compression
   * and the potential storage savings.
   */
  cacheCompressionRatio: number;
};
