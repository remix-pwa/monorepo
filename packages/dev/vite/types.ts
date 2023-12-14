import type { RemixConfig } from '@remix-run/dev/dist/config.js';
import type { RouteManifest } from '@remix-run/dev/dist/config/routes.js';
import type { RemixVitePluginOptions } from '@remix-run/dev/dist/vite/plugin.js';
import type { ResolvedConfig } from 'vite';

export interface PWAOptions extends RemixVitePluginOptions {
  registerSW: 'script' | null;
  serviceWorkerFile: string;
  workerBuildDirectory: string;
  scope: string;
  workerMinify: boolean;
  workerName: string;
  ignoredSWRouteFiles: string[];
  // future: unknown;
  // injectManifest: boolean; // wether manifest should also be injected. Do we handle manifest??
}

export interface ResolvedPWAOptions
  extends Pick<
    Required<PWAOptions>,
    | 'registerSW'
    | 'serviceWorkerFile'
    | 'workerBuildDirectory'
    | 'scope'
    | 'workerMinify'
    | 'workerName'
    | 'ignoredSWRouteFiles'
  > {
  includeAssets: RegExp[];
  excludeAssets: RegExp[];
  rootDirectory: string;
  appDirectory: string;
  serviceWorkerPath: string;
  routes: RouteManifest;
}

export interface PWAPluginContext {
  viteConfig: ResolvedConfig;
  pwaOptions: Partial<PWAOptions>;
  options: ResolvedPWAOptions;
  isDev: boolean;
}
