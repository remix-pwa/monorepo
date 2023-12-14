import { parse } from 'es-module-lexer';
import type { Plugin } from 'vite';
import type { PWAPluginContext } from 'vite/types.js';

export function EmptyModulesPlugin(ctx: PWAPluginContext): Plugin[] {
  return <Plugin[]>[
    {
      name: 'vite-plugin-remix-pwa:empty-server-modules',
      enforce: 'pre',
      async transform(_code, id, options) {
        if (options?.ssr) return;
        const serverFileRE = /\.server(\.[cm]?[jt]sx?)?$/;
        const serverDirRE = /\/\.server\//;
        if (serverFileRE.test(id) || serverDirRE.test(id)) {
          return {
            code: 'export {}',
            map: null,
          };
        }
      },
    },
    {
      name: 'vite-plugin-remix-pwa:empty-client-modules',
      enforce: 'post',
      async transform(code, id, options) {
        if (!options?.ssr) return;
        const clientFileRE = /\.client(\.[cm]?[jt]sx?)?$/;
        const clientDirRE = /\/\.client\//;

        if (clientFileRE.test(id) || clientDirRE.test(id)) {
          const exports = parse(code)[1];

          return {
            code: exports
              .map(({ n: name }: any) => (name === 'default' ? 'export default {};' : `export const ${name} = {};`))
              .join('\n'),
            map: null,
          };
        }
      },
    },
  ];
}
