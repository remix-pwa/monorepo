import type { RouteManifest } from '@remix-run/dev/dist/config/routes.js';
import * as _glob from 'fast-glob';
import { readFile } from 'fs/promises';
import { resolve } from 'pathe';
import type { Plugin } from 'vite';

import { parse } from '../babel.js';
import { resolveRouteModules } from '../resolve-route-modules.js';
import { resolveRouteWorkerApis } from '../resolve-route-workers.js';
import type { PWAPluginContext } from '../types.js';
import * as VirtualModule from '../vmod.js';

const { default: glob } = _glob;

export const shouldIgnoreRoute = (route: string, patterns: string[]): boolean => {
  if (route === '' || patterns.length === 0) return false;
  if (patterns.includes(route) || patterns.includes('*')) return true;

  route = route.startsWith('/') ? route : `/${route}`;

  const convertPatternToRegex = (pattern: string) => {
    // Remove leading and trailing slashes
    pattern = pattern.replace(/^\/|\/$/g, '');

    // Split the pattern into segments
    const segments = pattern.split('/');

    // Build the regex pattern
    let regexPattern = '';

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];

      if (segment === '**') {
        // Match any path segments
        regexPattern += '(?:/.*)?';
      } else if (segment === '*') {
        // Match a single path segment
        regexPattern += '/[^/]*';
      } else {
        // Match the literal segment
        regexPattern += `/${segment}`;
      }
    }

    // Ensure the regex matches the entire route
    regexPattern = `^${regexPattern}/?$`;

    return new RegExp(regexPattern);
  };

  const regexPatterns = patterns.map(convertPatternToRegex);
  return regexPatterns.some(regexPattern => regexPattern.test(route));
};

export const createRouteImports = (routes: RouteManifest, ignoredRoutes: string[] = []): string => {
  return Object.values(routes)
    .map((route, index) => {
      if (shouldIgnoreRoute(route.path ?? '', ignoredRoutes)) return '';
      return `import * as route${index} from ${JSON.stringify(`virtual:worker:${routes[route.id].file}`)};`;
    })
    .join('\n')
    .trim();
};

export const createRouteManifest = async (
  routes: RouteManifest,
  appDirectory: string,
  ignoredRoutes: string[] = []
): Promise<string> => {
  return (
    await Promise.all(
      Object.entries(routes).map(async ([key, route], index) => {
        if (shouldIgnoreRoute(route.path ?? '', ignoredRoutes)) return '';

        const srcContent = await readFile(resolve(appDirectory, route.file), 'utf-8');
        const sourceAst = parse(srcContent, {
          sourceType: 'module',
          plugins: ['jsx', 'typescript'],
        });

        const { hasAction, hasLoader, hasWorkerAction, hasWorkerLoader } = resolveRouteModules(sourceAst);

        return `${JSON.stringify(key)}: {
          id: "${route.id}",
          parentId: ${JSON.stringify(route.parentId)},
          path: ${JSON.stringify(route.path)},
          index: ${JSON.stringify(route.index)},
          caseSensitive: ${JSON.stringify(route.caseSensitive)},
          hasLoader: ${hasLoader},
          hasAction: ${hasAction},
          hasWorkerLoader: ${hasWorkerLoader},
          hasWorkerAction: ${hasWorkerAction},
          module: route${index}
        },`;
      })
    )
  )
    .join('\n')
    .trim();
};

export function VirtualSWPlugins(ctx: PWAPluginContext): Plugin[] {
  const entryId = VirtualModule.id('entry-sw');
  const assetsId = VirtualModule.id('assets-sw');

  const emptyFileName = VirtualModule.resolve('remix_pwa_plugin_ignore_empty_module_placeholder');

  const workerRouteCache = new Map();

  return <Plugin[]>[
    {
      name: 'vite-plugin-remix-pwa:empty-modules-sw',
      enforce: 'pre',
      async load(id) {
        if (
          id === emptyFileName ||
          id.match(/@remix-run\/(deno|cloudflare|node|react)(\/.*)/g) ||
          id.match(/react(-dom)?(\/.*)?$/g) ||
          id.match(/\.server/g) ||
          id.match(/web-push?$/g)
        ) {
          return 'module.exports = {};';
        }
      },
      async transform(code) {
        const regex = /\/\*\*[\s\S]*?\*\//g;

        const licenseComments = code.match(regex)?.filter(predicate => /@license/.test(predicate)) ?? [];
        code = code.replaceAll(regex, match => {
          if (licenseComments?.includes(match)) return match;
          return '';
        });
        return {
          code,
          map: { mappings: '' },
        };
      },
    },
    {
      name: 'vite-plugin-remix-pwa:virtual-entry-sw',
      resolveId(id) {
        if (id === entryId) {
          return VirtualModule.resolve(entryId);
        }
      },
      async load(id) {
        if (id === VirtualModule.resolve(entryId)) {
          const entryVirtualContents = [
            `import * as entryWorker from ${JSON.stringify(ctx.options.serviceWorkerPath)};`,
            '',
            `${createRouteImports(ctx.options.routes, ctx.options.ignoredSWRouteFiles)}`,
            '',
            'export const routes = {',
            `  ${await createRouteManifest(ctx.options.routes, ctx.options.appDirectory, ctx.options.ignoredSWRouteFiles)}`,
            '};',
            '',
            "export { assets } from 'virtual:assets-sw';",
            'export const entry = { module: entryWorker }',
          ]
            .join('\n')
            .trim();

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
        if (id.startsWith('virtual:worker:') && ctx.isRemixDevServer) {
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

          const workerContent = virtualRouteSource;

          // Cache the worker content
          workerRouteCache.set(filePath, workerContent);

          return workerContent;
        }
      },
    },
    {
      name: 'vite-plugin-remix-pwa:virtual-assets-sw',
      resolveId(id) {
        if (id === assetsId) {
          return VirtualModule.resolve(assetsId);
        }
      },
      async load(id) {
        if (id === VirtualModule.resolve(assetsId) && ctx.isRemixDevServer) {
          const remixPluginContext = ctx.__remixPluginContext;

          if (ctx.isDev) {
            const files = await glob(`**/*`, {
              ignore: ['**/*.map'],
              absolute: false,
              unique: true,
              caseSensitiveMatch: true,
              onlyFiles: true,
              cwd: resolve(remixPluginContext.rootDirectory, 'public'),
            }).catch(() => []);

            return `export const assets = ${JSON.stringify(
              files.map(file => `/${file}`),
              null,
              2
            )};`;
          }

          const files = await glob(`**/*`, {
            ignore: ['**/*.map'],
            absolute: false,
            unique: true,
            caseSensitiveMatch: true,
            onlyFiles: true,
            cwd: resolve(remixPluginContext.remixConfig.buildDirectory, 'client'),
          }).catch(() => []);

          const assetsVirtualContents = `export const assets = ${JSON.stringify(
            files.map(file => `/${file}`),
            null,
            2
          )};`;

          return assetsVirtualContents;
        }
      },
    },
  ];
}
