export { unregisterServiceWorker } from './src/utils/registration.js';
export {
  MatchRequest,
  MatchResponse,
  isAssetRequest,
  isLoaderRequest,
  isMethod,
  matchRequest,
} from './src/utils/worker.js';

export { logger } from './src/private/logger.js';

export { useSWEffect } from './src/hooks/useSWEffect.js';

export { MessageEnv, MessageHandler, MessageHandlerParams, MessagePlugin } from './src/message/message.js';
export { PrecacheHandler, PrecacheHandlerOptions, PrecacheHandlerState } from './src/message/precacheHandler.js';
export { RemixNavigationHandler, RemixNavigationHandlerOptions } from './src/message/remixNavigationHandler.js';

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
