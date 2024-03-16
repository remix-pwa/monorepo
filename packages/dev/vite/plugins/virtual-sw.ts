import type { RouteManifest } from '@remix-run/dev/dist/config/routes.js';
import { resolve } from 'pathe';
import type { Plugin } from 'vite';
import type { PWAPluginContext } from 'vite/types.js';

import * as VirtualModule from '../vmod.js';

export const shouldIgnoreRoute = (route: string, patterns: string[]): boolean => {
  if (route === '' || patterns.length === 0) return false;

  function convertPatternToRegEx(pattern: string) {
    if (pattern.endsWith('/') && pattern.substring(-2) !== '*') {
      pattern = pattern.split('').slice(0, -1).join('');
    }

    let regexPattern = pattern
      .replace(/^\//, '') // Remove leading slash if exists
      .replace(/\*\*/g, '.*') // Replace ** with .*
      .replace(/\*/g, '[^/]*') // Replace * with [^/]*
      .replace(/\//g, '\\/'); // Escape forward slashes

    if (!pattern.startsWith('/')) {
      regexPattern = '(?:\\/)?' + regexPattern; // Make leading slash optional
    }

    return new RegExp('^' + regexPattern + '$');
  }

  const regexPatterns = patterns.map(convertPatternToRegEx);

  return regexPatterns.some(regexPattern => regexPattern.test(route));
};

export const createRouteImports = (appDir: string, routes: RouteManifest, ignoredRoutes: string[] = []): string => {
  return Object.keys(routes)
    .map((route, index) => {
      if (shouldIgnoreRoute(route, ignoredRoutes)) return '';
      return `import * as route${index} from ${JSON.stringify(`${resolve(appDir)}/${routes[route].file}?worker`)};`;
    })
    .join('\n');
};

export const createRouteManifest = (routes: RouteManifest, ignoredRoutes: string[] = []): string => {
  return Object.entries(routes)
    .map(([key, route], index) => {
      if (shouldIgnoreRoute(route.path ?? '', ignoredRoutes)) return '';

      return `${JSON.stringify(key)}: {
          id: "${route.id}",
          parentId: ${JSON.stringify(route.parentId)},
          path: ${JSON.stringify(route.path)},
          index: ${JSON.stringify(route.index)},
          caseSensitive: ${JSON.stringify(route.caseSensitive)},
          module: route${index}
        }`;
    })
    .join(',\n');
};

export function VirtualSWPlugins(ctx: PWAPluginContext): Plugin[] {
  const entryId = VirtualModule.id('entry-sw');

  return <Plugin[]>[
    {
      name: 'vite-plugin-remix-pwa:virtual-entry-sw',
      resolveId(id) {
        if (id === entryId) {
          return VirtualModule.resolve(entryId);
        }
      },
      load(id) {
        if (id === VirtualModule.resolve(entryId)) {
          const entryVirtualContents = [
            `import * as entryWorker from ${JSON.stringify(ctx.options.serviceWorkerPath)};`,
            '',
            `${createRouteImports(ctx.options.appDirectory, ctx.options.routes, ctx.options.ignoredSWRouteFiles)}`,
            '',
            'export const routes = {',
            `  ${createRouteManifest(ctx.options.routes, ctx.options.ignoredSWRouteFiles)}`,
            '};',
            '',
            'export const entry = { module: entryWorker }',
            'export const msg = "hello world from virtual";',
          ].join('\n');

          console.log(entryVirtualContents);

          return entryVirtualContents;
        }
      },
    },
    {
      name: 'vite-plugin-remix-pwa:virtual-routes-sw',
      resolveId(id) {
        if (id.endsWith('?worker')) {
          return VirtualModule.resolve(id);
        }
      },
      load(id) {
        if (id.endsWith('?worker')) {
          console.log(id);
          return 'export const msg = "hello world from virtual";';
        }
      },
    },
  ];
}
