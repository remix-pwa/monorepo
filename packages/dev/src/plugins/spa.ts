import type { PWAPluginContext } from 'src/types.js';
import type { Plugin } from 'vite';

export function SPAPlugins(ctx: PWAPluginContext) {
  return <Plugin[]>[
    {
      name: 'vite-plugin-remix-pwa:spa-fetch-inject',
      enforce: 'pre',
      transform(code, id) {
        if (Array.isArray(id.match(/root\.(tsx|jsx)$/)) && !ctx.__remixPluginContext.remixConfig.ssr) {
          return code.replace(
            '</head>',
            [
              "<script id='vite-plugin-remix-pwa:spa-fetch-inject' dangerouslySetInnerHTML={{",
              ' __html: `',
              '  ;(function() {',
              '    const originalFetch = window.fetch;',
              "    console.log('fetch override applied');",
              '    window.fetch = function(input, init = {}) {',
              '      init = init || {};',
              '      init.headers = {',
              '        ...init.headers,',
              "        'X-Custom-Route': window.location.pathname,",
              '      };',
              '      return originalFetch.call(this, input, init);',
              '    };',
              '',
              '    // Listen for React Router route changes',
              "    window.addEventListener('popstate', function() {",
              "      console.log('Route changed to: ', window.location.pathname);",
              '    });',
              '  })();',
              ' `',
              '}}/>',
              '</head>',
            ]
              .join('\n')
              .trim()
          );
        }
      },
    },
  ];
}
