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
      name: 'vite-plugin-remix-pwa:empty-react-modules',
      enforce: 'post',
      async transform(_code, id, options) {
        if (!options?.ssr) return;
        const reactModules = /^react(-dom)?(\/.*)?$/;

        if (reactModules.test(id)) {
          return {
            code: 'export {}',
            map: null,
          };
        }
      },
    },
    {
      name: 'vite-plugin-remix-pwa:empty-remix-modules',
      enforce: 'post',
      async transform(_code, id, options) {
        if (!options?.ssr) return;
        const remixModules = /^@remix-run\/(deno|cloudflare|node|react)(\/.*)?$/;

        if (remixModules.test(id)) {
          return {
            code: 'export {}',
            map: null,
          };
        }
      },
    },
  ];
}
