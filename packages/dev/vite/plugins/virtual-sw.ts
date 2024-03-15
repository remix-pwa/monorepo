import { readFileSync } from 'fs';
import { resolve } from 'path';
import { normalizePath, type Plugin } from 'vite';
import type { PWAPluginContext } from 'vite/types.js';

import * as VirtualModule from '../vmod.js';

export function VirtualSWPlugins(ctx: PWAPluginContext): Plugin[] {
  const vmodId = VirtualModule.id('sw');

  return <Plugin[]>[
    {
      name: 'vite-plugin-remix-pwa:virtual-sw',
      configureServer(server) {
        server.watcher.add(normalizePath(resolve(ctx.options.appDirectory, ctx.options.entryWorkerFile)));
      },
      handleHotUpdate({ file, server }) {
        if (file === normalizePath(resolve(ctx.options.appDirectory, ctx.options.entryWorkerFile))) {
          const swModule = server.moduleGraph.getModuleById(vmodId);

          if (swModule) {
            server.moduleGraph.invalidateModule(swModule);
            return [];
          }
        }
      },
      resolveId(id) {
        if (id === vmodId) {
          return { id };
        }
      },
      load(id) {
        if (id === vmodId) {
          const swPath = resolve(ctx.options.appDirectory, ctx.options.entryWorkerFile);
          const swCode = readFileSync(swPath, 'utf-8');
          return swCode;
        }
      },
      buildEnd() {
        // Additional build steps if needed
        console.log('Built virtual sw module!');
      },
    },
  ];
}
