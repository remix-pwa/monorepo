import type { OnLoadResult, OnResolveArgs, Plugin, PluginBuild } from 'esbuild';
import { normalize } from 'node:path';

const FILTER_REGEX = /\?user$/;

/**
 * The `sw-side-effects` plugin marks the user entry.worker as sideEffect to prevent esbuild from tree shaking it.
 */
export default function sideEffectsPlugin(): Plugin {
  async function setup(build: PluginBuild) {
    const onResolve = ({ path }: OnResolveArgs) => ({
      path: normalize(path).replace(FILTER_REGEX, ''),
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
