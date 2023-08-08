import type { AppConfig, ResolvedRemixConfig } from '@remix-run/dev';
import { readConfig as _readConfig, findConfig } from '@remix-run/dev/dist/config.js';
import type { ServerMode } from '@remix-run/dev/dist/config/serverModes.js';
import { resolve } from 'node:path';

const EXTENSIONS = ['.js', '.mjs', '.cjs'];

interface Config {
  /**
   * The path to the user custom worker implementation file.
   */
  worker?: string;
  /**
   * The file name of the final bundled worker file.
   */
  workerName?: string;
  /**
   * Whether to minify the worker file.
   */
  workerMinify?: boolean;
  /**
   * The directory to write the worker file to.
   */
  workerBuildDirectory?: string;
  /**
   * Whether to generate a sourcemap for the worker file.
   */
  workerSourcemap?: boolean;
}

export type WorkerConfig = AppConfig & Config;
export type ResolvedWorkerConfig = ResolvedRemixConfig & Required<Config> & { entryWorkerFile: string };

/**
 * Reads the remix.config.js file and returns the config object.
 */
export default async function readConfig(remixRoot: string, mode: ServerMode): Promise<ResolvedWorkerConfig> {
  const remixConfig = await _readConfig(remixRoot, mode);
  const workerConfig = await import(findConfig(remixRoot, 'remix.config', EXTENSIONS) as string).then(
    m => m.default ?? m
  );

  return {
    ...remixConfig,
    entryWorkerFile: resolve(remixConfig.appDirectory, 'entry.worker.js'),
    worker: workerConfig.worker ?? require.resolve('@remix-pwa/worker-runtime'),
    workerBuildDirectory: workerConfig.workerBuildDirectory ?? resolve('./public'),
    workerName: workerConfig.workerName ?? 'service-worker',
    workerMinify: workerConfig.workerMinify ?? false,
    workerSourcemap: workerConfig.workerSourcemap ?? false,
  };
}
