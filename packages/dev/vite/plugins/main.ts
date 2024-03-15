import type { Plugin } from 'vite';
import type { PWAPluginContext } from 'vite/types.js';

import { resolveOptions } from '../resolver.js';

export function EntryPlugin(ctx: PWAPluginContext): Plugin {
  return <Plugin>{
    name: 'vite-plugin-remix-pwa:entry',
    enforce: 'pre',
    async configResolved(config) {
      ctx.isDev = config.mode === 'development';
      ctx.viteConfig = config;
      ctx.options = await resolveOptions(ctx.pwaOptions, config);
    },
  };
}
