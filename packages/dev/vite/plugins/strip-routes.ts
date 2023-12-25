import { normalizePath, type Plugin } from 'vite';
import type { PWAPluginContext } from 'vite/types.js';

export function StripRoutesPlugin(ctx: PWAPluginContext): Plugin {
  return <Plugin>{
    name: 'vite-plugin-remix-pwa:strip-routes',
    enforce: 'pre',
    async transform(code, id) {
      const routes = ctx.options.routes;

      if (/\.[t,j]sx$/gi.test(id)) {
        const routeId = id
          .replace(normalizePath(ctx.options.appDirectory), '')
          .replace(/\.[t,j]sx$/gi, '')
          .replace(/^\/?/gi, '');

        if (routes[routeId]) {
          const workerExportsMatch =
            /export\s+(const|let|var|async\s+function|function)\s+(workerAction|workerLoader)/g.exec(code);

          if (workerExportsMatch) {
            return code.substring(0, workerExportsMatch.index) + code.substring(workerExportsMatch.index + 6);
          }
        }
      }
    },
  };
}
