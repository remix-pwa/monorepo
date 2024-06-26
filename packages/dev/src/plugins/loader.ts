import type { Plugin } from 'vite';

import type { PWAPluginContext } from '../types.js';

export function LoaderPlugin(ctx: PWAPluginContext): Plugin {
  return <Plugin>{
    name: 'vite-plugin-remix-pwa:loader',
    enforce: 'pre',
    transform(code, id) {
      if (Array.isArray(id.match(/root\.(tsx|jsx)$/)) && ctx.options.registerSW === 'script') {
        return code.replace(
          '</head>',
          [
            "<script type='module' id='vite-plugin-remix-pwa:loader::inject-sw' dangerouslySetInnerHTML={{",
            ' __html: `',
            '  async function register() {',
            `   const reg = await navigator.serviceWorker.register('/${ctx.options.workerName}.js', {`,
            `    scope: ${JSON.stringify(ctx.options.scope)},`,
            "    type: 'classic',",
            "    updateViaCache: 'none',",
            '   })',
            '',
            '   window.$ServiceWorkerHMRHandler$ = async () => {',
            '    await reg.update();',
            '   }',
            '  }',
            '',
            "  if ('serviceWorker' in navigator) {",
            "   if (document.readyState === 'complete' || document.readyState === 'interactive') {",
            '    register();',
            '   } else {',
            "    window.addEventListener('load', register);",
            '    }',
            '  }',
            ' `}}',
            '/>',
            '</head>',
          ]
            .join('\n')
            .trim()
        );
      } else {
        return;
      }
    },
  };
}
