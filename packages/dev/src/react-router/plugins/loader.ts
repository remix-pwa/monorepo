import type { Plugin } from 'vite';

import type { PWAPluginContext } from '../types.js';

export function LoaderPlugin(ctx: PWAPluginContext): Plugin {
  return <Plugin>{
    name: 'vite-plugin-react-router-pwa:loader',
    enforce: 'pre',
    // configResolved(config) {
    //   console.log('configResolved', config);
    // },
    transform(code, id) {
      if (Array.isArray(id.match(/root\.(tsx|jsx)$/))) {
        if (code.includes('<PWAScripts')) {
          ctx.viteConfig.logger.warnOnce(
            '💥 Usage of `PWAScripts` disables Service Worker injection! Either remove it or disable `injectSWRegister`'
          );

          return code;
        }
        console.log('code', ctx.options);
        return code.replace(
          '</head>',
          [
            "<script type='module' id='vite-plugin-react-router-pwa:loader::inject-sw' dangerouslySetInnerHTML={{",
            ' __html: `',
            '  async function register() {',
            `   //const reg = await navigator.serviceWorker.register('/${ctx.options.workerName}.js', {`,
            `    //scope: ${JSON.stringify(ctx.options.scope)},`,
            `    //type: 'classic',`,
            `    //updateViaCache: 'none',`,
            '   //})',
            '',

            '   //window.$ServiceWorkerHMRHandler$ = async () => {',
            '   //    await reg.update();',
            '   //}',
            '   console.log("register");',
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
      }
    },
  };
}
