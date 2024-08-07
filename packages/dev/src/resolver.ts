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

  const isDev = process.env.NODE_ENV === 'development';

  const {
    buildVariables = options.buildVariables
      ? options.buildVariables
      : {
          'process.env.NODE_ENV': isDev ? 'development' : 'production',
        },
    entryWorkerFile: serviceWorkerFile = (options.entryWorkerFile || 'entry.worker.ts').trim(),
    ignoredSWRouteFiles = options.ignoredSWRouteFiles || [],
    registerSW = options.registerSW ?? 'script',
    // If it isn't 'public', or 'build/client' then the user input their own override 📌
    scope = options.scope || viteConfig.base,
    workerBuildDirectory = options.workerBuildDirectory || isDev ? 'public' : 'build/client',
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
    buildVariables,
    routes,
    entryWorkerFile: removeTrailingSlashes(serviceWorkerFile),
    serviceWorkerPath: resolve(appDirectory, removeTrailingSlashes(serviceWorkerFile)),
    appDirectory: normalizePath(appDirectory),
    ignoredSWRouteFiles,
    rootDirectory,
    workerName,
  } as ResolvedPWAOptions;
}
