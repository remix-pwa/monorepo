import type { Plugin } from 'vite';

import { resolveOptions } from '../resolver.js';
import type { PWAOptions, PWAPluginContext } from '../types.js';

export function EntryPlugin(ctx: PWAPluginContext, pwaOptions: Partial<PWAOptions>): Plugin {
  return <Plugin>{
    name: 'vite-plugin-remix-pwa:entry',
    enforce: 'pre',
    async configResolved(config) {
      ctx.isDev = config.mode === 'development';
      // @ts-ignore - Utilizing remix special config here
      ctx.isRemixDevServer = config.__remixPluginContext !== undefined;
      ctx.viteConfig = config;
      // @ts-ignore - Also utilizing remix special config here
      ctx.__remixPluginContext = config.__remixPluginContext ?? undefined;
      ctx.options = await resolveOptions(pwaOptions, config);
    },
  };
}
