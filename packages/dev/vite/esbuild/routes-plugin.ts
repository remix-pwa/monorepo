import type { OnLoadArgs, OnLoadResult, OnResolveArgs, Plugin, PluginBuild } from 'esbuild';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import type { ResolvedEsbuildConfig } from 'vite/types.js';

import { parse } from '../babel.js';
import { resolveRouteWorkerApis } from '../resolve-route-workers.js';

const FILTER_REGEX = /\?worker$/;
const NAMESPACE = 'routes-module';

export default function routesModulesPlugin(config: ResolvedEsbuildConfig): Plugin {
  async function setup(build: PluginBuild) {
    const onResolve = ({ path }: OnResolveArgs) => ({ path, namespace: NAMESPACE });
    const onLoad = async ({ path }: OnLoadArgs) => {
      const file = path.replace(FILTER_REGEX, '');
      const source = await readFile(resolve(config.appDirectory, file), {
        encoding: 'utf-8',
      });

      const sourceAst = parse(source, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });

      const virtualRouteSource = resolveRouteWorkerApis({ ast: sourceAst, source });

      return {
        contents: virtualRouteSource,
        resolveDir: config.appDirectory,
        loader: 'ts',
      } as OnLoadResult;
    };

    build.onResolve({ filter: FILTER_REGEX }, onResolve);
    build.onLoad({ filter: FILTER_REGEX, namespace: NAMESPACE }, onLoad);
  }

  return {
    name: 'sw-routes-modules',
    setup,
  };
}
