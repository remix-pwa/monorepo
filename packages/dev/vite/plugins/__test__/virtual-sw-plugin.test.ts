import type { RouteManifest } from '@remix-run/dev/dist/config/routes';
import { afterAll, afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

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

  describe('VirtualSWPlugin suite', () => {
    describe('Virtual Entry Plugin', () => {
      
    })
  })
});
