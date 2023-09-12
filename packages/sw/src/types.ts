/// <reference lib="WebWorker" />
import type { AppData, AppLoadContext, DataFunctionArgs } from '@remix-run/server-runtime';
import type { ServerRouteModule } from '@remix-run/server-runtime/dist/routeModules.js';
import type { ServerRoute } from '@remix-run/server-runtime/dist/routes.js';

/**
 * An object of unknown type for routes worker actions and loaders provided
 * by the worker's `getLoadContext` function.
 */
export interface WorkerLoadContext extends AppLoadContext {
  event: FetchEvent;
  fetchFromServer: () => Promise<Response>;
}

/**
 * The arguments passed to a worker data function. Could be a worker action or
 * loader. The `context` property is provided by the worker's `getLoadContext`
 * function. Alternatively, use the `WorkerLoaderArgs` or `WorkerActionArgs`
 * types.
 */
export type WorkerDataFunctionArgs = Omit<DataFunctionArgs, 'context'> & {
  context: WorkerLoadContext;
};

/**
 * The arguments passed to a worker loader function.
 */
export type WorkerLoaderArgs = WorkerDataFunctionArgs;

/**
 * The arguments passed to a worker action function.
 */
export type WorkerActionArgs = WorkerDataFunctionArgs;

/**
 * A worker action function.
 */
export interface WorkerActionFunction {
  (args: WorkerActionArgs): Promise<Response> | Response | Promise<AppData> | AppData;
}

/**
 * A worker loader function.
 */
export interface WorkerLoaderFunction {
  (args: WorkerLoaderArgs): Promise<Response> | Response | Promise<AppData> | AppData;
}

export interface WorkerRouteModule extends ServerRouteModule {
  workerAction?: WorkerActionFunction;
  workerLoader?: WorkerLoaderFunction;
}

export interface WorkerRoute extends Omit<ServerRoute, 'children'> {
  hasWorkerAction: boolean;
  hasWorkerLoader: boolean;
  module: WorkerRouteModule;
}

/**
 * The worker routes manifest.
 */
export interface WorkerRouteManifest {
  [routeId: string]: WorkerRoute;
}

/**
 * The default fetch handler.
 *
 * This acts as a fallback when a route doesn't have a worker action or loader.
 */
export type DefaultFetchHandler = (
  args: WorkerDataFunctionArgs
) => Promise<Response> | Response | Promise<AppData> | AppData;

/**
 * The default error handler.
 *
 * This acts as a fallback when a worker action or loader throws an
 * unhandled error.
 */
export type DefaultErrorHandler = (error: Error, args: WorkerDataFunctionArgs) => void;

/**
 * The `getLoadContext` function used to create a globally accessible
 * `context` object for worker actions and loaders.
 */
export type GetLoadContextFunction = (event: FetchEvent) => WorkerLoadContext;

declare global {
  interface ServiceWorkerGlobalScope {
    __workerManifest: {
      routes: WorkerRouteManifest;
      assets: string[];
    };
  }
}
