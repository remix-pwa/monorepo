import type { RouteManifest } from '@remix-run/dev/dist/config/routes.js';
import type { RemixVitePluginOptions } from '@remix-run/dev/dist/vite/plugin.js';
import type { ResolvedConfig } from 'vite';

export interface PWAOptions extends RemixVitePluginOptions {
  registerSW: 'script' | null;
  entryWorkerFile: string;
  workerBuildDirectory: string;
  scope: string;
  workerMinify: boolean;
  workerName: string;
  ignoredSWRouteFiles: string[];
  workerSourceMap: boolean;
  workerEntryPoint: string;
  // future: unknown;
  // injectManifest: boolean; // wether manifest should also be injected. Do we handle manifest??
}

export interface ResolvedPWAOptions
  extends Pick<
    Required<PWAOptions>,
    | 'registerSW'
    | 'entryWorkerFile'
    | 'workerBuildDirectory'
    | 'scope'
    | 'workerMinify'
    | 'workerName'
    | 'workerSourceMap'
    | 'ignoredSWRouteFiles'
    | 'workerEntryPoint'
  > {
  includeAssets: RegExp[];
  excludeAssets: RegExp[];
  rootDirectory: string;
  appDirectory: string;
  serviceWorkerPath: string;
  routes: RouteManifest;
  assetsBuildDirectory: string;
}

export interface PWAPluginContext {
  viteConfig: ResolvedConfig;
  pwaOptions: Partial<PWAOptions>;
  options: ResolvedPWAOptions;
  isDev: boolean;
}

export interface ResolvedEsbuildConfig {
  routes: RouteManifest;
  entryWorkerFile: string;
  appDirectory: string;
  assetsBuildDirectory: string;
}
