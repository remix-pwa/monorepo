import { getRouteModuleExports } from '@remix-run/dev/dist/compiler/utils/routeExports.js';
import type { OnLoadArgs, OnLoadResult, OnResolveArgs, Plugin, PluginBuild } from 'esbuild';

import type { ResolvedWorkerConfig } from '../utils/config.js';
const FILTER_REGEX = /\?worker$/;
const NAMESPACE = 'routes-module';

export default function routesModulesPlugin(config: ResolvedWorkerConfig): Plugin {
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
      const sourceExports = await getRouteModuleExports(config, route.id);
      const theExports = sourceExports.filter(
        exp => exp === 'workerAction' || exp === 'workerLoader' || exp === 'handle'
      );

      let contents = 'module.exports = {};';
      if (theExports.length > 0) {
        const spec = `{ ${theExports.join(', ')} }`;
        contents = `export ${spec} from ${JSON.stringify(`./${file}`)};`;
      }
      return {
        contents,
        resolveDir: config.appDirectory,
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
