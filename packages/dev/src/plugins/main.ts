import type { Plugin } from 'vite';

import { resolveOptions } from '../resolver.js';
import type { PWAOptions, PWAPluginContext } from '../types.js';

export function EntryPlugin(ctx: PWAPluginContext, pwaOptions: Partial<PWAOptions>): Plugin {
  return <Plugin>{
    name: 'vite-plugin-react-router-pwa:entry',
    enforce: 'pre',
    async configResolved(config) {
      ctx.isDev = process.env.NODE_ENV === 'development';
      // @ts-ignore - Utilizing react-router special config here
      ctx.isReactRouterDevServer = config.__reactRouterPluginContext !== undefined;
      ctx.viteConfig = config;
      // @ts-ignore - Also utilizing react-router special config here
      ctx.__reactRouterPluginContext = config.__reactRouterPluginContext ?? undefined;
      ctx.options = await resolveOptions(pwaOptions, config);
    },
  };
}
