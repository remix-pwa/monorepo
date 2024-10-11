import type { EntryRoute, RouteManifest } from '@remix-run/react/dist/routes';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { matchUrlToRoute } from '../installPWAGlobals';

describe('installPWAGlobals utils test suite', () => {
  describe('URL to id matcher util test', () => {
    const mockManifest = {
      root: { id: 'root', path: '/' },
      'routes/_index': { id: 'routes/_index', index: true, parentId: 'root' },
      'routes/about': { id: 'routes/about', path: '/about' },
      'routes/users': { id: 'routes/users', path: '/users' },
      'routes/users/_index': { id: 'routes/users/_index', path: '/users', index: true },
      'routes/users/$userId': { id: 'routes/users/$userId', path: '/users/:userId' },
      'routes/users/$userId/_index': { id: 'routes/users/$userId/_index', path: '/users/:userId', index: true },
      'routes/products/$category/$productId': {
        id: 'routes/products/$category/$productId',
        path: '/products/:category/:productId',
      },
    } as unknown as RouteManifest<EntryRoute>;

    beforeEach(() => {
      vi.stubGlobal('window', {
        __remixManifest: { routes: mockManifest },
        location: { origin: 'https://example.com' },
      });
    });

    test('should match root route', () => {
      expect(matchUrlToRoute('/', mockManifest)).toBe('root');
    });

    test('should match index route', () => {
      expect(matchUrlToRoute('/?index', mockManifest)).toBe('routes/_index');
    });

    test('should match about route', () => {
      expect(matchUrlToRoute('/about', mockManifest)).toBe('routes/about');
    });

    test('should match users route', () => {
      expect(matchUrlToRoute('/users', mockManifest)).toBe('routes/users');
    });

    test('should match users index route', () => {
      // console.log(matchUrlToRoute('/users?index', mockManifest));
      expect(matchUrlToRoute('/users?index', mockManifest)).toBe('routes/users/_index');
    });

    test('should match user detail route', () => {
      expect(matchUrlToRoute('/users/123', mockManifest)).toBe('routes/users/$userId');
    });

    test('should match user detail index route', () => {
      expect(matchUrlToRoute('/users/123?index', mockManifest)).toBe('routes/users/$userId/_index');
    });

    test('should match nested route with multiple parameters', () => {
      expect(matchUrlToRoute('/products/electronics/laptop-123', mockManifest)).toBe(
        'routes/products/$category/$productId'
      );
    });

    test('should return null for non-existent route', () => {
      expect(matchUrlToRoute('/non-existent', mockManifest)).toBeNull();
    });

    test('should handle trailing slashes', () => {
      expect(matchUrlToRoute('/about/', mockManifest)).toBe('routes/about');
    });

    test('should handle query parameters', () => {
      expect(matchUrlToRoute('/users?sort=asc', mockManifest)).toBe('routes/users');
    });

    test('should prioritize index routes when index param is present', () => {
      expect(matchUrlToRoute('/users?index&sort=asc', mockManifest)).toBe('routes/users/_index');
    });

    test('should match root route when no index param is present', () => {
      expect(matchUrlToRoute('/?sort=asc', mockManifest)).toBe('root');
    });

    test('should correctly match nested index route', () => {
      expect(matchUrlToRoute('/users/123?index', mockManifest)).toBe('routes/users/$userId/_index');
    });

    test('should not match root index for all index queries', () => {
      expect(matchUrlToRoute('/users?index', mockManifest)).toBe('routes/users/_index');
      expect(matchUrlToRoute('/about?index', mockManifest)).toBe(null);
    });

    test('should match parent index route when child has no index', () => {
      expect(matchUrlToRoute('/products/electronics/laptop-123?index', mockManifest)).toBe(null);
    });

    test('should handle full URLs with nested index routes', () => {
      expect(matchUrlToRoute(`https://example.com/users/123?index`, mockManifest)).toBe('routes/users/$userId/_index');
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });
  });
});
