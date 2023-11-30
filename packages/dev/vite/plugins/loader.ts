import type { Plugin } from 'vite';
import type { PWAPluginContext } from 'vite/context.js';

export function LoaderPlugin(ctx: PWAPluginContext): Plugin {
  return <Plugin>{
    name: 'vite-plugin-remix-pwa:loader',
    enforce: 'pre',
    transform(code, id) {
      if (Array.isArray(id.match(/root\.(tsx|jsx)$/))) {
        console.log('Transforming!', ctx);

        console.log('Within root file!', id, code);
        return code.replace(
          '</head>',
          ["<script id='vite-plugin-remix-pwa:loader::inject-sw'>", '</script>', '</head>'].join('\n')
        );
      }
    },
  };
}
