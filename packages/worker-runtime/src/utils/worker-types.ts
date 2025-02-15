/// <reference lib="WebWorker" />
import type { ActionFunction, AppLoadContext, DataFunctionArgs, LoaderFunction } from '@remix-run/server-runtime';
import type { ServerRouteModule } from '@remix-run/server-runtime/dist/routeModules.js';
import type { ServerRoute } from '@remix-run/server-runtime/dist/routes.js';

throw new Error(
  '@remix-pwa/dev/worker-build is not meant to be used directly from node_modules.' +
    // eslint-disable-next-line prettier/prettier
  ' It exists to provide type definitions for a virtual module provided' +
    // eslint-disable-next-line prettier/prettier
  ' by the Remix PWA compiler at build time.'
);

export interface WorkerLoadContext extends AppLoadContext {
  event: FetchEvent;
  fetchFromServer: () => Promise<Response>;
}
export type WorkerDataFunctionArgs = Omit<DataFunctionArgs, 'context'> & {
  context: WorkerLoadContext;
};
export type WorkerLoaderArgs = WorkerDataFunctionArgs;
export type WorkerActionArgs = WorkerDataFunctionArgs;
export type DefaultFetchHandlerArgs = WorkerDataFunctionArgs;
export interface WorkerActionFunction {
  (args: WorkerActionArgs): ReturnType<ActionFunction>;
}
export interface WorkerLoaderFunction {
  (args: WorkerLoaderArgs): ReturnType<LoaderFunction>;
}
export type DefaultFetchHandler = (args: DefaultFetchHandlerArgs) => Promise<Response>;
export type DefaultErrorHandler = (error: Error, args: WorkerDataFunctionArgs) => void;
export interface WorkerRouteModule extends ServerRouteModule {
  workerAction?: WorkerActionFunction;
  workerLoader?: WorkerLoaderFunction;
}
export interface WorkerRoute extends Omit<ServerRoute, 'children'> {
  hasWorkerAction: boolean;
  hasWorkerLoader: boolean;
  module: WorkerRouteModule;
}

export interface WorkerRouteManifest {
  [routeId: string]: WorkerRoute;
}

export interface WorkerEntryModule {
  defaultFetchHandler?: DefaultFetchHandler;
  handleError?: DefaultErrorHandler;
  getLoadContext?: (event: FetchEvent) => WorkerLoadContext;
}
export interface BuildEntry {
  module: WorkerEntryModule;
}

// These are the types that are actually exported by the virtual module.
export const entry: BuildEntry = undefined!;
export const routes: WorkerRouteManifest = undefined!;
