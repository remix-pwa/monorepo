import { getRouteModuleExports } from '@remix-run/dev/dist/compiler/utils/routeExports.js';
import type { OnLoadArgs, OnLoadResult, OnResolveArgs, Plugin, PluginBuild } from 'esbuild';
import type { ResolvedEsbuildConfig } from 'vite/types.js';
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
      // const sourceExports = await getRouteModuleExports(config, route.id);
      // const theExports = sourceExports.filter(
      //   exp => exp === 'workerAction' || exp === 'workerLoader' || exp === 'handle'
      // );

      // let contents = 'module.exports = {};';
      // if (hasWorkerExports(theExports)) {
      //   const spec = `{ ${theExports.join(', ')} }`;
      //   contents = `export ${spec} from ${JSON.stringify(`./${file}`)};`;
      // }
      return {
        contents: '',
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
function hasWorkerExports(theExports: string[]) {
  return theExports.filter(exp => exp.includes('worker')).length > 0;
}
