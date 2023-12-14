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
    ignoredSWRouteFiles = options.ignoredSWRouteFiles || [],
    registerSW = options.registerSW ?? 'script',
    scope = options.scope || viteConfig.base,
    serviceWorkerFile = (options.serviceWorkerFile || 'entry.worker.ts').trim(),
    workerBuildDirectory = options.workerBuildDirectory ||
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- viteConfig.publicDir is always defined
      normalizePath(viteConfig.publicDir).split(normalizePath(viteConfig.root)).pop()!,
    workerMinify = options.workerMinify || false,
    workerName = options.workerName || 'entry.worker',
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

  const { appDirectory, routes } = await resolveConfig(remixConfig, { rootDirectory });

  const includeAssets = [/\.(js|css|html|svg|png|jpg|jpeg|webp)$/];
  const excludeAssets = [/\.map$/, /^manifest.*\.json$/, /^sw\.js$/];

  return {
    workerMinify,
    workerBuildDirectory: `${viteConfig.root}/${removeTrailingSlashes(workerBuildDirectory)}`,
    registerSW,
    scope,
    routes,
    serviceWorkerFile: removeTrailingSlashes(serviceWorkerFile),
    serviceWorkerPath: `${appDirectory}/${removeTrailingSlashes(serviceWorkerFile)}`,
    includeAssets,
    excludeAssets,
    appDirectory,
    ignoredSWRouteFiles,
    rootDirectory,
    workerName,
  };
}
