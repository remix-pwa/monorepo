import type { ConfigRoute, RouteManifest } from '@remix-run/dev/dist/config/routes.js';
import { normalizePath, type Plugin } from 'vite';
import type { PWAPluginContext } from 'vite/types.js';

import * as VirtualModule from '../vmod.js';

/**
 * Creates a string representation of the routes to be imported
 */
function createRouteImports(routes: ConfigRoute[], appDir: string): string {
  return routes
    .map(
      (route, index) =>
        `import * as route${index} from ${JSON.stringify(`${normalizePath(appDir)}/${route.file}?worker`)};`
    )
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

export function EntryVModPlugin(ctx: PWAPluginContext): Plugin {
  const pwaEntryModuleId = VirtualModule.id('pwa-entry-module');

  return <Plugin>{
    name: 'vite-plugin-remix-pwa:magic-entry',
    enforce: 'pre',
    resolveId(id) {
      if (id === pwaEntryModuleId) {
        return VirtualModule.resolve(pwaEntryModuleId);
      }
    },
    async load(id) {
      if (id === VirtualModule.resolve(pwaEntryModuleId)) {
        const routes = Object.values(ctx.options.routes);

        return `
// import * as entryWorker from ${JSON.stringify(normalizePath(ctx.options.serviceWorkerPath))};

${createRouteImports(routes, ctx.options.appDirectory)}

export const routes = {
  ${createRouteManifest(ctx.options.routes)}
}

// export { assets } from '@remix-pwa/dev?assets';
// export const entry = { module: entryWorker };
        `.trim();
      }
    },
  };
}
