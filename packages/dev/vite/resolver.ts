import type { AppConfig } from '@remix-run/dev/dist/config.js';
import { resolveConfig } from '@remix-run/dev/dist/config.js';
import type { RemixVitePluginOptions } from '@remix-run/dev/dist/vite/plugin.js';
import pick from 'lodash/pick.js';
import type { ResolvedConfig } from 'vite';
import { normalizePath } from 'vite';

import type { PWAOptions, ResolvedPWAOptions } from './types.js';

const supportedRemixConfigKeys = [
  'appDirectory',
  'assetsBuildDirectory',
  'future',
  'ignoredRouteFiles',
  'publicPath',
  'routes',
  'serverBuildPath',
  'serverModuleFormat',
] as const satisfies ReadonlyArray<keyof AppConfig>;

const removeTrailingSlashes = (str: string): string => str.replace(/^\/|\/$/g, '');

export async function resolveOptions(
  options: Partial<PWAOptions>,
  viteConfig: ResolvedConfig
): Promise<ResolvedPWAOptions> {
  const {
    entryWorkerFile: serviceWorkerFile = (options.entryWorkerFile || 'entry.worker.ts').trim(),
    ignoredSWRouteFiles = options.ignoredSWRouteFiles || [],
    registerSW = options.registerSW ?? 'script',
    scope = options.scope || viteConfig.base,
    workerBuildDirectory = options.workerBuildDirectory ||
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- viteConfig.publicDir is always defined
      normalizePath(viteConfig.publicDir).split(normalizePath(viteConfig.root)).pop()!,
    workerEntryPoint = options.workerEntryPoint || '@remix-pwa/worker-runtime',
    workerMinify = options.workerMinify || false,
    workerName = options.workerName || 'entry.worker',
    workerSourceMap = options.workerSourceMap || false,
  } = options;

  const defaults: Partial<RemixVitePluginOptions> = {
    serverBuildPath: 'build/server/index.js',
    assetsBuildDirectory: 'build/client',
    publicPath: '/',
  };

  const remixConfig = {
    ...defaults,
    ...pick(options, supportedRemixConfigKeys),
  };

  const rootDirectory = viteConfig.root ?? process.env.REMIX_ROOT ?? process.cwd();

  const { appDirectory, assetsBuildDirectory, routes } = await resolveConfig(remixConfig, { rootDirectory });

  const includeAssets = [/\.(js|css|html|svg|png|jpg|jpeg|webp)$/];
  const excludeAssets = [/\.map$/, /^manifest.*\.json$/, /^sw\.js$/];

  return {
    workerMinify,
    workerEntryPoint,
    workerSourceMap,
    workerBuildDirectory: `${viteConfig.root}/${removeTrailingSlashes(workerBuildDirectory)}`,
    registerSW,
    assetsBuildDirectory,
    scope,
    routes,
    entryWorkerFile: removeTrailingSlashes(serviceWorkerFile),
    serviceWorkerPath: `${appDirectory}/${removeTrailingSlashes(serviceWorkerFile)}`,
    includeAssets,
    excludeAssets,
    appDirectory,
    ignoredSWRouteFiles,
    rootDirectory,
    workerName,
  } as ResolvedPWAOptions;
}
