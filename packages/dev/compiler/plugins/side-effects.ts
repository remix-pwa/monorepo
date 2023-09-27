import type { OnLoadResult, Plugin, PluginBuild } from 'esbuild';

import type { ResolvedWorkerConfig } from '../utils/config.js';
const FILTER_REGEX = /\?user$/;

/**
 * The `sw-side-effects` plugin marks the user entry.worker as sideEffect to prevent esbuild from tree shaking it.
 */
export default function sideEffectsPlugin(config: ResolvedWorkerConfig): Plugin {
  async function setup(build: PluginBuild) {
    const onResolve = () => ({
      path: config.entryWorkerFile,
      sideEffects: true,
    });

    const onLoad = async () => ({ loader: 'js' }) as OnLoadResult;

    build.onResolve({ filter: FILTER_REGEX }, onResolve);
    build.onLoad({ filter: FILTER_REGEX }, onLoad);
  }

  return {
    name: 'sw-side-effects',
    setup,
  };
}
