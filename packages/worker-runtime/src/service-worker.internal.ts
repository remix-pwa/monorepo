import * as build from '@remix-pwa/dev/worker-build.js';

import { handleRequest } from './utils/handle-request.js';

const _self = self as unknown as ServiceWorkerGlobalScope & typeof globalThis;

/**
 * Creates the load context for the worker action and loader.
 */
function createContext(event: FetchEvent): build.WorkerLoadContext {
  // getLoadContext is a function exported by the `entry.worker.js`
  const context = build.entry.module.getLoadContext?.(event) || {};
  return {
    event,
    fetchFromServer: () => fetch(event.request),
    // NOTE: we want the user to override the above properties if needed.
    ...context,
  };
}

// if the user export a `defaultFetchHandler` inside the entry.worker.js, we use that one as default handler
const defaultHandler =
  (build.entry.module.defaultFetchHandler as build.DefaultFetchHandler) ||
  ((event: FetchEvent) => fetch(event.request.clone()));
// if the user export a `handleError` inside the entry.worker.js, we use that one as default handler
const defaultErrorHandler =
  (build.entry.module.handleError as build.DefaultErrorHandler) ||
  ((error: Error, { request }: build.WorkerDataFunctionArgs) => {
    if (!request.signal.aborted) {
      console.error(error);
    }
  });

_self.addEventListener(
  'fetch',
  /**
   * The main fetch event listener callback.
   */
  event => {
    const response = handleRequest({
      event,
      routes: build.routes,
      defaultHandler,
      errorHandler: defaultErrorHandler,
      loadContext: createContext(event as FetchEvent),
    });
    return (event as FetchEvent).respondWith(response);
  }
);
