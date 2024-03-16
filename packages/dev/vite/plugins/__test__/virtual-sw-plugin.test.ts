import type { RouteManifest } from '@remix-run/dev/dist/config/routes';
import { afterAll, afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

describe('Remix PWA Vite VirtualSW Plugin', () => {
  describe('Plugin utilities suite', () => {
    // More test cases and free-styling here
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
        expect(result).toBe(`\nimport * as route1 from "virtual:worker:about.tsx";`);
      });
    });
  });
});
