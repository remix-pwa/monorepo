import type { Plugin } from 'vite';
import type { PWAPluginContext } from 'vite/context.js';

export function EntryPlugin(ctx: PWAPluginContext): Plugin {
  return <Plugin>{
    name: 'vite-plugin-remix-pwa:entry',
    enforce: 'pre',
    configResolved(config) {
      ctx.isDev = config.mode === 'development';
      ctx.viteConfig = config;
    },
  };
}
