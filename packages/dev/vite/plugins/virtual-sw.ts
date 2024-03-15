import type { Plugin } from 'vite';
import type { PWAPluginContext } from 'vite/types.js';

import * as VirtualModule from '../vmod.js';

export function VirtualSWPlugins(): Plugin[] {
  const entryId = VirtualModule.id('entry-sw');

  return <Plugin[]>[
    {
      name: 'vite-plugin-remix-pwa:virtual-entry-sw',
      resolveId(id) {
        if (id === entryId) {
          return VirtualModule.resolve(entryId);
        }
      },
      load(id) {
        if (id === VirtualModule.resolve(entryId)) {
          return 'export const msg = "hello world from virtual";';
        }
      },
    },
  ];
}
