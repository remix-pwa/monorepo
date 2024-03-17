import type { RouteManifest } from '@remix-run/dev/dist/config/routes';
import { afterAll, afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import type { PWAPluginContext } from '../../types';

vi.doMock('pathe', () => {
  return {
    resolve: (path: string, filePath: string) => `${path}/${filePath}`,
  };
});
vi.doMock('fs/promises', () => {
  return {
    readFile: async (path: string) => {
      if (path.includes('home'))
        return `
      export const action = () => {
        return { name: 'home' };
      }`;

      return `
      export const action = () => {
        return { name: 'about' };
      }

      export const loader = () => {
        return { name: 'about', worker: false };
      }

      export const workerLoader = () => {
        return { name: 'about', worker: true };
      }
      `;
    },
  };
});
vi.doMock('../../babel.js', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    parse: (code: string, _options: any) => code,
  };
});
vi.doMock('../../resolve-route-workers.js', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resolveRouteWorkerApis: ({ ast: _sourceAst, source }: any) => {
      if (source.includes('workerLoader'))
        return `export const workerLoader = () => {
        return { name: 'about', worker: true };
      }`;
      else return 'module.exports = {}';
    },
  };
});

describe('Remix PWA Vite VirtualSW Plugin', () => {
  describe('Plugin utilities suite', () => {
    describe('Route ignore suite', () => {
      test('should ignore route if it is in the ignore list', async () => {
        const { shouldIgnoreRoute } = await import('../virtual-sw');
        const result = shouldIgnoreRoute('home', ['home']);
        expect(result).toBe(true);
      });

      test('should not ignore route if it is not in the ignore list', async () => {
        const { shouldIgnoreRoute } = await import('../virtual-sw');
        const result = shouldIgnoreRoute('home', ['about']);
        expect(result).toBe(false);
      });

      test('should not ignore route if ignore list is empty', async () => {
        const { shouldIgnoreRoute } = await import('../virtual-sw');
        const result = shouldIgnoreRoute('home', []);
        expect(result).toBe(false);
      });

      test('should make leading slashes optional', async () => {
        const { shouldIgnoreRoute } = await import('../virtual-sw');
        expect(shouldIgnoreRoute('/home', ['home'])).toBe(true);
        expect(shouldIgnoreRoute('home', ['/home'])).toBe(true);
        expect(shouldIgnoreRoute('home', ['home'])).toBe(true);
        expect(shouldIgnoreRoute('/home', ['/home'])).toBe(true);
      });

      test('should make trailing slashes optional', async () => {
        const { shouldIgnoreRoute } = await import('../virtual-sw');
        expect(shouldIgnoreRoute('/home', ['home/'])).toBe(true);
        expect(shouldIgnoreRoute('/home', ['/home/'])).toBe(true);
        expect(shouldIgnoreRoute('home', ['home/'])).toBe(true);
        expect(shouldIgnoreRoute('home', ['/home/'])).toBe(true);
      });

      test('should ignore route glob patterns', async () => {
        const { shouldIgnoreRoute } = await import('../virtual-sw');
        expect(shouldIgnoreRoute('/home', ['*'])).toBe(true);
        expect(shouldIgnoreRoute('/home', ['**'])).toBe(true);

        expect(shouldIgnoreRoute('/user/home/rooms', ['*/home/*'])).toBe(true);
        expect(shouldIgnoreRoute('/user/home/rooms', ['/**/home/*'])).toBe(true);
        expect(shouldIgnoreRoute('/user/home/rooms', ['**/home/'])).toBe(false);
        expect(shouldIgnoreRoute('/user/home/rooms', ['home/**'])).toBe(false);

        expect(shouldIgnoreRoute('/user/home', ['user/*'])).toBe(true);
        expect(shouldIgnoreRoute('/user/home/rooms', ['user/**'])).toBe(true);

        expect(shouldIgnoreRoute('/user/home/rooms', ['user/home/*'])).toBe(true);
        expect(shouldIgnoreRoute('/user/home/rooms', ['user/home/**'])).toBe(true);

        expect(shouldIgnoreRoute('/user/home/rooms', ['**/rooms/'])).toBe(true);
        expect(shouldIgnoreRoute('/user/home/rooms', ['**/rooms'])).toBe(true);
        expect(shouldIgnoreRoute('/user/home/rooms', ['*/rooms/'])).toBe(false);
        expect(shouldIgnoreRoute('/user/home/rooms', ['*/rooms'])).toBe(false);
      });
    });

    describe('Route imports creation suite', () => {
      test('should create route import statements from manifest', async () => {
        const { createRouteImports } = await import('../virtual-sw');
        const routes = {
          'routes/home': {
            id: 'routes/home',
            parentId: 'root',
            path: '/home',
            index: false,
            caseSensitive: true,
            file: 'home.tsx',
          },
          'routes/about': {
            id: 'routes/about',
            parentId: 'root',
            path: '/about',
            index: false,
            caseSensitive: true,
            file: 'about.tsx',
          },
        } as RouteManifest;

        const result = createRouteImports(routes, []);
        expect(result).toBe(
          `import * as route0 from "virtual:worker:home.tsx";\nimport * as route1 from "virtual:worker:about.tsx";`
        );
      });

      test('should ignore routes in imports if passed into generator', async () => {
        const { createRouteImports } = await import('../virtual-sw');
        const routes = {
          'routes/home': {
            id: 'routes/home',
            parentId: 'root',
            path: '/home',
            index: false,
            caseSensitive: true,
            file: 'home.tsx',
          },
          'routes/about': {
            id: 'routes/about',
            parentId: 'root',
            path: '/about',
            index: false,
            caseSensitive: true,
            file: 'about.tsx',
          },
        } as RouteManifest;

        const result = createRouteImports(routes, ['home']);
        expect(result).toBe(`import * as route1 from "virtual:worker:about.tsx";`);
      });
    });

    describe('Route manifest creation suite', () => {
      test('should create route manifest from routes', async () => {
        const { createRouteManifest } = await import('../virtual-sw');
        const routes = {
          'routes/home': {
            id: 'routes/home',
            parentId: 'root',
            path: '/home',
            index: false,
            caseSensitive: true,
            file: 'home.tsx',
          },
          'routes/about': {
            id: 'routes/about',
            parentId: 'root',
            path: '/about',
            index: false,
            caseSensitive: true,
            file: 'about.tsx',
          },
        } as RouteManifest;

        const result = createRouteManifest(routes, []);
        expect(result).toBe(
          `"routes/home": {
          id: "routes/home",
          parentId: "root",
          path: "/home",
          index: false,
          caseSensitive: true,
          module: route0
        },
"routes/about": {
          id: "routes/about",
          parentId: "root",
          path: "/about",
          index: false,
          caseSensitive: true,
          module: route1
        },`
        );
      });

      test('should ignore routes in manifest if passed into generator', async () => {
        const { createRouteManifest } = await import('../virtual-sw');
        const routes = {
          'routes/home': {
            id: 'routes/home',
            parentId: 'root',
            path: '/home',
            index: false,
            caseSensitive: true,
            file: 'home.tsx',
          },
          'routes/about': {
            id: 'routes/about',
            parentId: 'root',
            path: '/about',
            index: false,
            caseSensitive: true,
            file: 'about.tsx',
          },
        } as RouteManifest;

        const result = createRouteManifest(routes, ['home']);
        expect(result).toBe(
          `"routes/about": {
          id: "routes/about",
          parentId: "root",
          path: "/about",
          index: false,
          caseSensitive: true,
          module: route1
        },`
        );
      });
    });
  });

  describe('VirtualSWPlugin test suite', () => {
    let mockContext: PWAPluginContext;
    let plugin: any;

    beforeEach(async () => {
      mockContext = {
        options: {
          serviceWorkerPath: '/Users/ryan/remix-project/app/service-worker.ts',
          ignoredSWRouteFiles: [],
          appDirectory: '/Users/ryan/remix-project/app',
          routes: {
            'routes/home': {
              id: 'routes/home',
              parentId: 'root',
              path: '/home',
              index: false,
              caseSensitive: true,
              file: 'home.tsx',
            },
            'routes/about': {
              id: 'routes/about',
              parentId: 'root',
              path: '/about',
              index: false,
              caseSensitive: true,
              file: 'about.tsx',
            },
          } as RouteManifest,
        },
      } as unknown as PWAPluginContext;

      const _plugin = (await import('../virtual-sw')).VirtualSWPlugins;
      plugin = _plugin(mockContext);
    });

    describe('Virtual Entry Plugin', () => {
      test('should return a plugin object', () => {
        expect(plugin[0]).not.toBe(null);
        expect(plugin[0]).toBeTypeOf('object');
      });

      test('should have the correct name', () => {
        expect(plugin[0].name).toBe('vite-plugin-remix-pwa:virtual-entry-sw');
      });

      test('should resolve the virtual entry id correctly', () => {
        expect(plugin[0].resolveId('virtual:entry-sw')).toBe('\0virtual:entry-sw');
      });

      test('should load the virtual entry module', () => {
        expect(plugin[0].load('\0virtual:entry-sw')).toContain('export const routes = {');
        expect(plugin[0].load('\0virtual:entry-sw')).toContain('export const entry = { module: entryWorker }');
      });
    });

    describe('Virtual Routes Plugin', () => {
      test('should return a plugin object', () => {
        expect(plugin[1]).not.toBe(null);
        expect(plugin[1]).toBeTypeOf('object');
      });

      test('should have the correct name', () => {
        expect(plugin[1].name).toBe('vite-plugin-remix-pwa:virtual-routes-sw');
      });

      test('should resolve the virtual routes id correctly', () => {
        expect(plugin[1].resolveId('virtual:worker:routes/home.tsx')).toBe('virtual:worker:routes/home.tsx');
      });

      test('should provide a virtual module for virtual worker files on load', async () => {
        const result = await plugin[1].load('virtual:worker:routes/about.tsx');

        expect(result).toContain('export const workerLoader = () => {');
      });

      test("should return an empty module if the route doesn't contain worker route apis", async () => {
        const result = await plugin[1].load('virtual:worker:routes/home.tsx');

        expect(result).toBe('module.exports = {}');
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    afterAll(() => {
      vi.clearAllMocks();
      vi.doUnmock('pathe');
      vi.doUnmock('fs/promises');
      vi.doUnmock('../../babel.js');
      vi.doUnmock('../../resolve-route-workers.js');
    });
  });
});
