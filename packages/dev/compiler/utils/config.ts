import type { AppConfig, ResolvedRemixConfig } from '@remix-run/dev';
import { readConfig as _readConfig, findConfig } from '@remix-run/dev/dist/config.js';
import type { ServerMode } from '@remix-run/dev/dist/config/serverModes.js';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const _require = createRequire(import.meta.url);

const EXTENSIONS = ['.js', '.mjs', '.cjs'];

interface Config {
  /**
   * The path to the entry worker file.
   * 
   * @default '<appDir>/entry.worker.ts'
   */
  entryWorkerFile?: string; 
  /**
   * The path to the user custom worker implementation runtime.
   * 
   * @default '@remix-pwa/worker-runtime'
   */
  worker?: string;
  /**
   * The file name of the final bundled worker file. 
   * **Without the extension.**
   * 
   * @default 'entry.worker'
   */
  workerName?: string;
  /**
   * Whether to minify the worker file.
   * 
   * @default false
   */
  workerMinify?: boolean;
  /**
   * The directory to write the worker file to.
   * 
   * @default '<root>/public'
   */
  workerBuildDirectory?: string;
  /**
   * Whether to generate a sourcemap for the worker file.
   * 
   * @default false
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
    entryWorkerFile: resolve(remixConfig.appDirectory, 'entry.worker.ts'),
    worker: workerConfig.worker ?? _require.resolve('@remix-pwa/worker-runtime'),
    workerBuildDirectory: workerConfig.workerBuildDirectory ?? resolve('./public'),
    workerName: workerConfig.workerName ?? 'entry.worker',
    workerMinify: workerConfig.workerMinify ?? false,
    workerSourcemap: workerConfig.workerSourcemap ?? false,
  };
}
