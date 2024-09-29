import type { PWAPluginContext } from 'src/types.js';
import type { Plugin } from 'vite';

export function SPAPlugins(ctx: PWAPluginContext) {
  return <Plugin[]>[
    {
      name: 'vite-plugin-remix-pwa:spa-fetch-override',
      enforce: 'pre',
      transform(code, id) {
        // Run in only SPA mode
        if (Array.isArray(id.match(/root\.(tsx|jsx)$/)) && !ctx.__remixPluginContext.remixConfig.ssr) {
          return code.replace(
            '</head>',
            [
              "<script id='vite-plugin-remix-pwa:spa::fetch-override' dangerouslySetInnerHTML={{",
              ' __html: `',
              '  ;(function() {',
              '    const $_o = window.fetch;',
              '    window.fetch = function(i,j={}) {',
              '      const url = new URL(i,window.location.href);',
              "      url.searchParams.append('_route',import.meta.url??'');",
              '      return $_o.call(this,url.toString(),j);',
              '    };',
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
