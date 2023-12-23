import type { OnLoadResult, Plugin, PluginBuild } from 'esbuild';
import type { ResolvedEsbuildConfig } from 'vite/types.js';

const FILTER_REGEX = /\?user$/;

/**
 * The `sw-side-effects` plugin marks the user entry.worker as sideEffect to prevent esbuild from tree shaking it.
 */
export default function sideEffectsPlugin(config: ResolvedEsbuildConfig): Plugin {
  async function setup(build: PluginBuild) {
    const onResolve = () => ({
      path: config.serviceWorkerPath,
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
