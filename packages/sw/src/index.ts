export { unregisterServiceWorker } from './utils/registration.js';
export {
  MatchRequest,
  MatchResponse,
  isAssetRequest,
  isLoaderRequest,
  isMethod,
  matchRequest,
} from './utils/worker.js';

export { logger } from './private/logger.js';

export { useSWEffect } from './hooks/useSWEffect.js';

export { MessageEnv, MessageHandler, MessageHandlerParams, MessagePlugin } from './message/message.js';
export { PrecacheHandler, PrecacheHandlerOptions, PrecacheHandlerState } from './message/precacheHandler.js';
export { RemixNavigationHandler, RemixNavigationHandlerOptions } from './message/remixNavigationHandler.js';

export { defer } from './react/defer.js';
export { json, redirect } from './react/utils.js';
