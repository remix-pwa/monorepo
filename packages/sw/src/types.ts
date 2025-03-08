/// <reference lib="WebWorker" />
import type { ActionFunction, LoaderFunction, Params } from 'react-router';

/**
 * An object of unknown type for route worker loaders and actions provided by the
 * worker's `getLoadContext()` function.  This is defined as an empty interface
 * specifically so apps can leverage declaration merging to augment this type
 * globally: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
 */
export interface AppLoadContext {
  [key: string]: unknown;
}

/**
 * An object of unknown type for routes worker actions and loaders provided
 * by the worker's `getLoadContext` function.
 */
export interface WorkerLoadContext extends AppLoadContext {
  event: FetchEvent;
  fetchFromServer: () => Promise<Response>;
}

// Import the DataFunctionArgs interface type from react-router
// We're using an interface declaration with the same structure
// since the actual DataFunctionArgs is not exported from react-router
// This matches the structure in react-router's DataFunctionArgs<Context>
interface DataFunctionArgs<Context> {
  request: Request;
  params: Params;
  context: Context;
}

/**
 * Arguments passed to route loader/action functions for worker routes.
 * Extends DataFunctionArgs with our worker-specific context.
 */
export interface WorkerDataFunctionArgs<C extends WorkerLoadContext = WorkerLoadContext> extends DataFunctionArgs<C> {
  /**
   * The worker context provided by the worker's `getLoadContext` function.
   * This context is extensible and can be customized by the user.
   */
  context: C;
}

/**
 * The arguments passed to a worker loader function.
 */
export type WorkerLoaderArgs<C extends WorkerLoadContext = WorkerLoadContext> = WorkerDataFunctionArgs<C>;

/**
 * The arguments passed to a worker action function.
 */
export type WorkerActionArgs<C extends WorkerLoadContext = WorkerLoadContext> = WorkerDataFunctionArgs<C>;

/**
 * The `defaultFetchHandler` arguments.
 */
export type DefaultFetchHandlerArgs<C extends WorkerLoadContext = WorkerLoadContext> = WorkerDataFunctionArgs<C>;

/**
 * A worker action function.
 */
export interface WorkerActionFunction<C extends WorkerLoadContext = WorkerLoadContext> {
  (args: WorkerActionArgs<C>): ReturnType<ActionFunction>;
}

/**
 * A worker loader function.
 */
export interface WorkerLoaderFunction<C extends WorkerLoadContext = WorkerLoadContext> {
  (args: WorkerLoaderArgs<C>): ReturnType<LoaderFunction>;
}

export interface WorkerRouteModule<C extends WorkerLoadContext = WorkerLoadContext> {
  workerAction?: WorkerActionFunction<C>;
  workerLoader?: WorkerLoaderFunction<C>;
}

export interface WorkerRoute<C extends WorkerLoadContext = WorkerLoadContext> {
  id: string;
  parentId?: string;
  path?: string;
  index?: boolean;
  caseSensitive?: boolean;
  hasAction: boolean;
  hasLoader: boolean;
  hasClientAction: boolean;
  hasClientLoader: boolean;
  hasWorkerAction: boolean;
  hasWorkerLoader: boolean;
  module: WorkerRouteModule<C>;
}

/**
 * The worker routes manifest.
 */
export interface WorkerRouteManifest<C extends WorkerLoadContext = WorkerLoadContext> {
  [routeId: string]: WorkerRoute<C>;
}

/**
 * The default fetch handler.
 *
 * This acts as a fallback when a route doesn't have a worker action or loader.
 */
export type DefaultFetchHandler<C extends WorkerLoadContext = WorkerLoadContext> = (
  args: WorkerDataFunctionArgs<C>
) => Promise<Response>;

/**
 * The default error handler.
 *
 * This acts as a fallback when a worker action or loader throws an
 * unhandled error.
 */
export type DefaultErrorHandler<C extends WorkerLoadContext = WorkerLoadContext> = (
  error: Error,
  args: WorkerDataFunctionArgs<C>
) => void;

/**
 * The `getLoadContext` function used to create a globally accessible
 * `context` object for worker actions and loaders.
 */
export type GetLoadContextFunction<C extends WorkerLoadContext = WorkerLoadContext> = (event: FetchEvent) => C;

declare global {
  interface ServiceWorkerGlobalScope {
    __workerManifest: {
      routes: WorkerRouteManifest;
      assets: string[];
    };
  }

  interface Window {
    $ServiceWorkerHMRHandler$: () => Promise<void>;
  }
}
