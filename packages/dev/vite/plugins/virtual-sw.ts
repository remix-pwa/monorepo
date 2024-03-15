import type { Plugin } from 'vite';
import type { PWAPluginContext } from 'vite/types.js';

import * as VirtualModule from '../vmod.js';

export function VirtualSWPlugins(ctx: PWAPluginContext): Plugin[] {
  const vmodId = VirtualModule.id('entry-sw');

  return <Plugin[]>[
    {
      name: 'vite-plugin-remix-pwa:virtual-entry-sw',
      load(id) {
        if (id === vmodId) {
          return 'export const msg = "hello world from virtual";';
        }
      },
    },
  ];
}
