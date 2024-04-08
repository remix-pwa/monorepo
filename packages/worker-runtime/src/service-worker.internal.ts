// @ts-expect-error
// eslint-disable-next-line import/no-unresolved
import * as build from 'virtual:entry-sw';

import { handleRequest } from './utils/handle-request.js';

const _self = self as unknown as ServiceWorkerGlobalScope & typeof globalThis;

declare global {
  interface ServiceWorkerGlobalScope {
    __workerManifest: {
      routes: build.WorkerRouteManifest;
      assets: string[];
    };
  }
}

/**
 * Creates the load context for the worker action and loader.
 */
function createContext(event: FetchEvent): build.WorkerLoadContext {
  // getLoadContext is a function exported by the `entry.worker.js`
  const context = build.entry.module.getLoadContext?.(event) || {};
  return {
    event,
    fetchFromServer: () => fetch(event.request.clone()),
    // NOTE: we want the user to override the above properties if needed.
    ...context,
  };
}

// if the user export a `defaultFetchHandler` inside the entry.worker.js, we use that one as default handler
const defaultHandler =
  (build.entry.module.defaultFetchHandler as build.DefaultFetchHandler) ||
  ((event: FetchEvent) => fetch(event.request.clone()));

// // if the user export a `errorHandler` inside the entry.worker.js, we use that one as default handler
const defaultErrorHandler =
  (build.entry.module.errorHandler as build.DefaultErrorHandler) ||
  ((error: Error, { request }: build.WorkerDataFunctionArgs) => {
    if (!request.signal.aborted) {
      console.error(error);
    }
  });

_self.__workerManifest = {
  // Re-publishing this. Somehow it's not available as `latest`
  assets: build.assets,
  routes: build.routes,
};

// DO NOT OVERRIDE!!!
_self.addEventListener(
  'fetch',
  /**
   * The main fetch event listener callback.
   */
  event => {
    /* Main request handler */
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
