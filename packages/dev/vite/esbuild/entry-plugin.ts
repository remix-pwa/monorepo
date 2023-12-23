import type { ConfigRoute, RouteManifest } from '@remix-run/dev/dist/config/routes.js';
import type { OnLoadResult, OnResolveArgs, Plugin, PluginBuild } from 'esbuild';
import type { ResolvedEsbuildConfig } from 'vite/types.js';

const FILTER_REGEX = /@remix-pwa\/build\/magic$/;
const NAMESPACE = 'entry-module';

/**
 * Creates a string representation of the routes to be imported
 */
function createRouteImports(routes: ConfigRoute[]): string {
  return routes
    .map((route, index) => `import * as route${index} from ${JSON.stringify(`${route.file}?worker`)};`)
    .join('\n');
}

/**
 * Creates a string representation of each route item.
 */
function createRouteManifest(routes: RouteManifest): string {
  return Object.entries(routes)
    .map(
      ([key, route], index) =>
        `${JSON.stringify(key)}: {
          id: "${route.id}",
          parentId: ${JSON.stringify(route.parentId)},
          path: ${JSON.stringify(route.path)},
          index: ${JSON.stringify(route.index)},
          caseSensitive: ${JSON.stringify(route.caseSensitive)},
          module: route${index}
        }`
    )
    .join(',\n');
}

/**
 * The `sw-entry-module` plugin looks for the `FILTER_REGEX`string throught the esbuild entry point and injects all the `@remix-run` routes modules and information
 * that are available in the given configuration into the ESBuild entry point.
 * @param {import('../utils/config.js').ResolvedWorkerConfig} config The resolved worker config.
 * @returns {import('esbuild').Plugin} Esbuild plugin
 */
export default function entryModulePlugin(config: ResolvedEsbuildConfig): Plugin {
  /**
   * @param {import('esbuild').PluginBuild} build The esbuild plugin build object.
   */
  function setup(build: PluginBuild) {
    const onResolve = ({ path }: OnResolveArgs) => ({ path, namespace: NAMESPACE });
    const onLoad = () => {
      const routes = Object.values(config.routes);
      const contents = `
      import * as entryWorker from ${JSON.stringify(config.serviceWorkerPath)};

    ${createRouteImports(routes)}

    export const routes = {
      ${createRouteManifest(config.routes)}
    };

    export { assets } from '@remix-pwa/dev?assets';
    export const entry = { module: entryWorker };
    `;

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
    name: 'sw-entry-module',
    setup,
  };
}
