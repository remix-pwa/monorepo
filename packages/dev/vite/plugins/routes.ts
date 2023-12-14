import { getRouteModuleExports } from '@remix-run/dev/dist/compiler/utils/routeExports.js';
import type { Plugin } from 'vite';
import type { PWAPluginContext } from 'vite/types.js';

import * as VirtualModule from '../vmod.js';

export function RoutesVModPlugin(ctx: PWAPluginContext): Plugin {
  const pwaRoutesModuleId = VirtualModule.id('pwa-routes-module');

  const routes = ctx.options.routes;
  const routesByFile = Object.keys(routes).reduce((map, key) => {
    const route = routes[key];
    map.set(route.file, route);
    return map;
  }, new Map());

  return <Plugin>{
    name: 'vite-plugin-remix-pwa:magic-routes',
    enforce: 'pre',
    resolveId(id) {
      if (id === pwaRoutesModuleId) {
        return VirtualModule.resolve(pwaRoutesModuleId);
      }
    },
    transform(code, id, options) {
      if (id === VirtualModule.id('pwa-entry-module')) {
        const lines = code.split('\n');

        const imports = lines.filter(line => line.startsWith('import * as route'));

        console.log('routes', imports);
      }
    },
    async load(id) {
      if (id === VirtualModule.resolve(pwaRoutesModuleId)) {
        // const file = path.replace(FILTER_REGEX, '');
        // const route = routesByFile.get(file);
        // const sourceExports = await getRouteModuleExports(config, route.id);
        // const theExports = sourceExports.filter(
        //   exp => exp === 'workerAction' || exp === 'workerLoader' || exp === 'handle'
        // );

        // const contents = 'module.exports = {};';
        // if (hasWorkerExports(theExports)) {
        //   const spec = `{ ${theExports.join(', ')} }`;
        //   contents = `export ${spec} from ${JSON.stringify(`./${file}`)};`;
        // }
        return ``.trim();
      }
    },
  };
}
