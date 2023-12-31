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

export type StrategyName = 'CacheFirst' | 'CacheOnly' | 'NetworkFirst' | 'NetworkOnly' | 'StaleWhileRevalidate';

export type StrategySelection<T> = T extends 'NetworkFirst'
  ? NetworkFriendlyOptions
  : T extends 'NetworkOnly'
    ? Omit<NetworkFriendlyOptions, 'cacheableResponse' | 'maxAgeSeconds' | 'maxEntries'>
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
  | StrategyWithOptions<'NetworkOnly'>
  | StrategyWithOptions<'StaleWhileRevalidate'>
);

export type CacheStats = {
  itemCount: number;
  totalSize: number;
};
