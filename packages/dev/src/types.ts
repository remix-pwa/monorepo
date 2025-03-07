import type { RouteManifest } from '@remix-run/dev/dist/config/routes.js';
import type { ResolvedConfig } from 'vite';

import type { ReactRouterPluginContext } from './patch.js';

/**
 * The `@remix-pwa/dev` vite plugin options.
 */
export interface PWAOptions {
  /**
   * Wether to inject a service worker registration script into your app or not.
   *
   * @default true
   */
  injectSWRegister: boolean;
  /**
   * The path to your entry worker file. Relative to the
   * `app` directory. *No trailing slashes please!*
   *
   * @default 'entry.worker.ts'
   */
  entryWorkerFile: string;
  /**
   * The output directory where the worker file will be built.
   *
   * @default 'public'
   */
  workerBuildDirectory: string;
  /**
   * Service Worker scope. This is used to control what pages can access the service worker.
   * If `registerSW` is `null`, it still needs to be set manually during registration.
   *
   * @default '/'
   */
  scope: string;
  /**
   * Minify worker code or not.
   *
   * @default false
   */
  workerMinify: boolean;
  /**
   * The name of the worker file.
   *
   * **NOTE:** Without the extension (`.js`|`.mjs`).
   *
   * @default 'entry.worker'
   */
  workerName: string;
  /**
   * Routes you want to ignore when generating the service worker.
   * This is useful when you have routes that are not handled by Remix.
   *
   * @default []
   */
  ignoredSWRouteFiles: string[];
  /**
   * Generate source map for worker file or not.
   *
   * @default false
   */
  workerSourceMap: boolean;
  /**
   * The entry point for the built service worker. Usually a runtime, but you can
   * provide your own script/runtime too.
   *
   * @default '@remix-pwa/worker-runtime'
   */
  workerEntryPoint: string;
  /**
   * Build/Environment variables to be injected into the worker file.
   *
   * @default
   * ```
   * {
   *   'process.env.NODE_ENV': "development" | "production",
   * }
   * ```
   */
  buildVariables: Record<string, string>;
  // future: unknown;
  // injectManifest: boolean; // wether manifest should also be injected. Do we handle manifest??
}

export interface ResolvedPWAOptions
  extends Pick<
    Required<PWAOptions>,
    | 'buildVariables'
    | 'entryWorkerFile'
    | 'ignoredSWRouteFiles'
    | 'injectSWRegister'
    | 'scope'
    | 'workerBuildDirectory'
    | 'workerEntryPoint'
    | 'workerMinify'
    | 'workerName'
    | 'workerSourceMap'
  > {
  rootDirectory: string;
  appDirectory: string;
  /**
   * The URL prefix of the public build with a trailing slash.
   */
  publicPath: string;
  /**
   * The full path to the entry worker file.
   *
   * @default `${appDirectory}/${entryWorkerFile}`
   */
  serviceWorkerPath: string;
  routes: RouteManifest;
}

export interface PWAPluginContext {
  viteConfig: ResolvedConfig;
  options: ResolvedPWAOptions;
  isDev: boolean;
  isReactRouterDevServer: boolean;
  __reactRouterPluginContext: ReactRouterPluginContext;
}

export interface ResolvedEsbuildConfig {
  routes: RouteManifest;
  entryWorkerFile: string;
  serviceWorkerPath: string;
  publicPath: string;
  rootDirectory: string;
  appDirectory: string;
  assetsBuildDirectory: string;
  ignoredSWRouteFiles: string[];
}
