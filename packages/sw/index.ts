export { unregisterServiceWorker } from './src/utils/registration.js';
export { clearUpOldCaches } from './src/utils/versioning.js';
export {
  MatchRequest,
  MatchResponse,
  isAssetRequest,
  isLoaderRequest,
  isMethod,
  matchRequest,
} from './src/utils/worker.js';

export { logger } from './src/private/logger.js';

export { UseSWEffectOptions, useSWEffect } from './src/hooks/useSWEffect.js';

export { MessageHandler } from './src/message/MessageHandler.js';
export { NavigationHandler, NavigationHandlerOptions } from './src/message/NavigationHandler.js';

export { defer } from './src/react/defer.js';
export { LoadServiceWorkerOptions, loadServiceWorker } from './src/react/loader.js';
export { json, redirect } from './src/react/utils.js';

export { LiveReload, LiveReloadV1 } from './src/react/LiveReload.js';

export type {
  DefaultErrorHandler,
  DefaultFetchHandler,
  GetLoadContextFunction,
  WorkerActionArgs,
  WorkerActionFunction,
  WorkerDataFunctionArgs,
  WorkerLoadContext,
  WorkerLoaderArgs,
  WorkerLoaderFunction,
  WorkerRoute,
  WorkerRouteManifest,
  WorkerRouteModule,
} from './src/types.js';

export { BaseStrategy } from './src/cache/BaseStrategy.js';
export { CacheFirst } from './src/cache/CacheFirst.js';
export { CacheOnly } from './src/cache/CacheOnly.js';
export { EnhancedCache } from './src/cache/EnhancedCache.js';
export { NetworkFirst } from './src/cache/NetworkFirst.js';
export { StaleWhileRevalidate } from './src/cache/StaleWhileRevalidate.js';
export type {
  CacheFriendlyOptions,
  CacheOptions,
  CacheStats,
  EnhancedCacheOptions,
  NetworkFriendlyOptions,
  StrategyName,
} from './src/cache/types.js';
