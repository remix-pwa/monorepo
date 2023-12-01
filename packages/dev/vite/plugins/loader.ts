import type { Plugin } from 'vite';

import type { PWAPluginContext } from '../types.js';

export function LoaderPlugin(ctx: PWAPluginContext): Plugin {
  return <Plugin>{
    name: 'vite-plugin-remix-pwa:loader',
    enforce: 'pre',
    transform(code, id) {
      if (Array.isArray(id.match(/root\.(tsx|jsx)$/))) {
        console.log('Transforming!', ctx);

        const modifiedCode = code.replace(
          '</head>',
          [
            "<script type='module' id='vite-plugin-remix-pwa:loader::inject-sw' dangerouslySetInnerHTML={{",
            ' __html: `',
            '  function register() {',
            "   navigator.serviceWorker.register('/entry.worker.js', {",
            "    scope: '/',",
            "    type: 'classic',",
            "    updateViaCache: 'none',",
            '   })',
            '  }',
            '',
            "  if ('serviceWorker' in navigator) {",
            "   if (document.readyState === 'complete' || document.readyState === 'interactive') {",
            '    register();',
            '   } else {',
            "    window.addEventListener('load', register);",
            '      }',
            '  }',
            ' `}}',
            '/>',
            '</head>',
          ].join('\n')
        );

        console.log('Within root file!', id, modifiedCode);

        return modifiedCode;
      }
    },
  };
}
