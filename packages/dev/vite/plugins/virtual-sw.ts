import type { RouteManifest } from '@remix-run/dev/dist/config/routes.js';
import { readFile } from 'fs/promises';
import { resolve } from 'pathe';
import type { Plugin } from 'vite';
import type { PWAPluginContext } from 'vite/types.js';

import { parse } from '../babel.js';
import { resolveRouteWorkerApis } from '../resolve-route-workers.js';
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

export const createRouteImports = (routes: RouteManifest, ignoredRoutes: string[] = []): string => {
  return Object.keys(routes)
    .map((route, index) => {
      if (shouldIgnoreRoute(route, ignoredRoutes)) return '';
      return `import * as route${index} from ${JSON.stringify(`virtual:worker:${routes[route].file}`)};`;
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

  const workerRouteCache = new Map();

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
            `${createRouteImports(ctx.options.routes, ctx.options.ignoredSWRouteFiles)}`,
            '',
            'export const routes = {',
            `  ${createRouteManifest(ctx.options.routes, ctx.options.ignoredSWRouteFiles)}`,
            '};',
            '',
            'export const entry = { module: entryWorker }',
            'export const msg = "hello world from virtual";',
          ].join('\n');

          return entryVirtualContents;
        }
      },
    },
    {
      name: 'vite-plugin-remix-pwa:virtual-routes-sw',
      resolveId(id) {
        if (id.startsWith('virtual:worker:')) {
          return id;
        }
      },
      async load(id) {
        if (id.startsWith('virtual:worker:')) {
          const filePath = id.replace('virtual:worker:', '');

          if (workerRouteCache.has(filePath)) {
            return workerRouteCache.get(filePath);
          }

          const virtualModuleSymlink = resolve(ctx.options.appDirectory, filePath);

          const source = await readFile(virtualModuleSymlink, {
            encoding: 'utf-8',
          });
          const sourceAst = parse(source, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript'],
          });
          const virtualRouteSource = resolveRouteWorkerApis({ ast: sourceAst, source });

          console.log(virtualRouteSource);

          const workerContent = virtualRouteSource;

          // Cache the worker content
          workerRouteCache.set(filePath, workerContent);

          return workerContent;
        }
      },
    },
  ];
}
