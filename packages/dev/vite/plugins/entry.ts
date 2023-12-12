import type { Plugin } from 'vite';
import type { PWAPluginContext } from 'vite/types.js';

import * as VirtualModule from '../vmod.js';

export function EntryVModPlugin(ctx: PWAPluginContext): Plugin {
  const pwaEntryModuleId = VirtualModule.id('pwa-entry-module');

  return <Plugin>{
    name: 'vite-plugin-remix-pwa:vmod-entry',
    resolveId(id) {
      if (id === pwaEntryModuleId) {
        return VirtualModule.resolve(pwaEntryModuleId);
      }
    },
    load(id) {
      if (id === VirtualModule.resolve(pwaEntryModuleId)) {
        return `
          // import * as entryWorker from '${ctx.viteConfig.root}/app/${ctx.options.serviceWorkerSrc}';
          // {createRouteImports(ctx.routes)}
          // export const routes = {
          //   // {createRouteManifest(ctx.routes)}
          //   '/': 'index',
          // };
          export const routes = "from virtual module"
        `.trim();
      }
    },
  };
}
