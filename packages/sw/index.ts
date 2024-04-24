export { unregisterServiceWorker } from './src/utils/registration.js';
export { clearUpOldCaches } from './src/utils/versioning.js';

export { Logger, logger } from './src/logger/logger.js';
export type { LogLevel, LoggerOptions, LoggerStyles } from './src/logger/logger.js';

export { UseSWEffectOptions, useSWEffect } from './src/hooks/useSWEffect.js';

export { MessageHandler } from './src/message/MessageHandler.js';
export { NavigationHandler, NavigationHandlerOptions } from './src/message/NavigationHandler.js';
export { SkipWaitHandler } from './src/message/SkipWaitHandler.js';

export { defer } from './src/utils/defer.js';
export { LoadServiceWorkerOptions, loadServiceWorker } from './src/utils/loader.js';
export {
  isActionRequest,
  isDocumentRequest,
  isHttpRequest,
  isLoaderRequest,
  isMethod,
  json,
  messageSW,
  redirect,
  sendSkipWaitingMessage,
  timeout,
  toJSON,
} from './src/utils/utils.js';
export type { JsonFunction, RedirectFunction } from './src/utils/utils.js';

export { ManifestLink } from './src/components/ManifestLink.js';

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
