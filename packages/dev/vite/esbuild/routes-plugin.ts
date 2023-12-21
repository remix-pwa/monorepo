import type { OnLoadArgs, OnLoadResult, OnResolveArgs, Plugin, PluginBuild } from 'esbuild';
import { readFile } from 'fs/promises';
import { dirname, resolve } from 'node:path';
import type { ResolvedEsbuildConfig } from 'vite/types.js';

import { parse } from '../babel.js';
import { resolveRouteWorkerApis } from '../resolve-route-workers.js';

const FILTER_REGEX = /\?worker$/;
const NAMESPACE = 'routes-module';

export default function routesModulesPlugin(config: ResolvedEsbuildConfig): Plugin {
  const routesByFile = Object.keys(config.routes).reduce((map, key) => {
    const route = config.routes[key];
    map.set(route.file, route);
    return map;
  }, new Map());

  async function setup(build: PluginBuild) {
    const onResolve = ({ path }: OnResolveArgs) => ({ path, namespace: NAMESPACE });
    const onLoad = async ({ path }: OnLoadArgs) => {
      const file = path.replace(FILTER_REGEX, '');
      // const route = routesByFile.get(file);
      // Todo: Fix!
      const source = await readFile(`app/${file}`, {
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
