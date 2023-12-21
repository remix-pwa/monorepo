import type { OnLoadArgs, OnLoadResult, OnResolveArgs, Plugin, PluginBuild } from 'esbuild';
import { readFile } from 'fs/promises';
import { resolve,dirname } from 'node:path';
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
      const route = routesByFile.get(file);
      const source = await readFile(route, { encoding: 'utf-8' });

      const sourceAst = parse(source, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });

      const virtualRouteSource = resolveRouteWorkerApis({ ast: sourceAst, source });

      return {
        contents: '',
        resolveDir: resolve(config.appDirectory, dirname(route)), // huh?
        loader: 'js',
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
function hasWorkerExports(theExports: string[]) {
  return theExports.filter(exp => exp.includes('worker')).length > 0;
}
