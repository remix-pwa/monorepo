import { resolve } from 'pathe';
import type { ResolvedConfig } from 'vite';
import { normalizePath } from 'vite';

import type { PWAOptions, ResolvedPWAOptions } from './types.js';

const removeTrailingSlashes = (str: string): string => str.replace(/^\/|\/$/g, '');

// hmr support -/- auto-register, prompt or do nothing

export async function resolveOptions(
  options: Partial<PWAOptions>,
  viteConfig: ResolvedConfig & { __remixPluginContext?: any }
): Promise<ResolvedPWAOptions> {
  if (!viteConfig.__remixPluginContext) {
    return {} as ResolvedPWAOptions;
  }

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

  const rootDirectory = viteConfig.root ?? process.env.REMIX_ROOT ?? process.cwd();

  const { appDirectory, publicPath, routes } = viteConfig.__remixPluginContext.remixConfig;

  return {
    workerMinify,
    workerEntryPoint,
    publicPath,
    workerSourceMap,
    workerBuildDirectory: resolve(viteConfig.root, removeTrailingSlashes(workerBuildDirectory)),
    registerSW,
    scope,
    routes,
    entryWorkerFile: removeTrailingSlashes(serviceWorkerFile),
    serviceWorkerPath: resolve(appDirectory, removeTrailingSlashes(serviceWorkerFile)),
    appDirectory: normalizePath(appDirectory),
    ignoredSWRouteFiles,
    rootDirectory,
    workerName,
  } as ResolvedPWAOptions;
}
