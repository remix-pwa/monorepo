import { afterEach, beforeEach } from 'node:test';
import type { ResolvedConfig } from 'vite';
import { afterAll, assert, beforeAll, describe, expect, test, vi } from 'vitest';

import type { PWAOptions, ResolvedPWAOptions } from '../types.js';
import { mockViteConfig } from './vite-config.js';

describe('Plugin context test suite', () => {
  beforeAll(() => {
    vi.doMock('../context.js', () => {
      return {
        createContext: vi.fn().mockReturnValue({}),
      };
    });
  });

  test('should create a global context when fed with user options', async () => {
    const { createContext } = await import('../context.js');

    createContext({});

    expect(createContext).toHaveBeenCalled();
    expect(createContext).toHaveBeenCalledWith({});
  });

  afterAll(() => {
    vi.doUnmock('../context.js');
  });
});

describe('Plugin resolver test suite', () => {
  beforeEach(() => {
    vi.doMock('../resolver.js', () => {
      return {
        resolveOptions: (opts: Partial<PWAOptions>, config: ResolvedConfig) =>
          Promise.resolve({ ...opts, config } as unknown as ResolvedPWAOptions),
      };
    });
  });

  test('should resolve options', async () => {
    const { resolveOptions } = await import('../resolver.js');

    const options = await resolveOptions({}, mockViteConfig as ResolvedConfig);

    assert(options);
    expect(options).toEqual({
      minify: false,
      publicDir: '/Users/ryan/Projects/remix-pwa/public',
      registerSW: 'script',
      scope: '/',
      rootDir: '/Users/ryan/Projects/remix-pwa',
      serviceWorkerSrc: '/Users/ryan/Projects/remix-pwa/app/entry.worker.ts',
      includeAssets: [/\.(js|css|html|svg|png|jpg|jpeg|webp)$/],
      excludeAssets: [/\.map$/, /^manifest.*\.json$/, /^sw\.js$/],
      appDir: '/Users/ryan/Projects/remix-pwa/app',
      ignoredRouteFiles: [],
    });
  });

  test('should resolve options with user options', async () => {
    const { resolveOptions } = await import('../resolver.js');

    const options = await resolveOptions(
      {
        minify: true,
        publicDir: 'public',
        registerSW: null,
        scope: '/pwa',
      },
      mockViteConfig as ResolvedConfig
    );

    assert(options);
    expect(options).toEqual({
      minify: true,
      publicDir: '/Users/ryan/Projects/remix-pwa/public',
      registerSW: null,
      rootDir: '/Users/ryan/Projects/remix-pwa',
      scope: '/pwa',
      serviceWorkerSrc: '/Users/ryan/Projects/remix-pwa/app/entry.worker.ts',
      includeAssets: [/\.(js|css|html|svg|png|jpg|jpeg|webp)$/],
      excludeAssets: [/\.map$/, /^manifest.*\.json$/, /^sw\.js$/],
      appDir: '/Users/ryan/Projects/remix-pwa/app',
      ignoredRouteFiles: [],
    });
  });

  test('should trim weird file paths provided by user', async () => {
    const { resolveOptions } = await import('../resolver.js');

    const options = await resolveOptions(
      {
        serviceWorkerSrc: '/entry.worker.ts',
        publicDir: '/out/dist/',
      },
      mockViteConfig as ResolvedConfig
    );

    assert(options);
    expect(options).toEqual({
      minify: false,
      publicDir: '/Users/ryan/Projects/remix-pwa/out/dist',
      registerSW: 'script',
      rootDir: '/Users/ryan/Projects/remix-pwa',
      scope: '/',
      serviceWorkerSrc: '/Users/ryan/Projects/remix-pwa/app/entry.worker.ts',
      includeAssets: [/\.(js|css|html|svg|png|jpg|jpeg|webp)$/],
      excludeAssets: [/\.map$/, /^manifest.*\.json$/, /^sw\.js$/],
      appDir: '/Users/ryan/Projects/remix-pwa/app',
      ignoredRouteFiles: [],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.doUnmock('../resolver.js');
  });
});

describe('Plugin virtual module utility test suite', () => {
  beforeEach(() => {
    vi.doMock('../vmod.js', () => {
      return {
        id: (name: string) => `virtual:${name}`,
        resolve: (id: string) => `\0${id}`,
        url: (id: string) => `/@id/__x00__${id}`,
      };
    });
  });

  test('should create a vite-compatible virtual module id', async () => {
    const { id } = await import('../vmod.js');

    expect(id('name')).toBe('virtual:name');
  });

  test('should resolve to a vite-compatible virtual module', async () => {
    const { resolve } = await import('../vmod.js');

    expect(resolve('name')).toBe('\0name');
  });

  test('should create a vite-compatible virtual module url', async () => {
    const { url } = await import('../vmod.js');

    expect(url('name')).toBe('/@id/__x00__name');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.doUnmock('../vmod.js');
  });
});
