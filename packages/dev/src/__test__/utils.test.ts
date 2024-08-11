import type { ResolvedRemixConfig } from '@remix-run/dev';
import type { ResolvedConfig } from 'vite';
import { afterAll, afterEach, assert, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import type { ResolvedPWAOptions } from '../types.js';
import { mockViteConfig } from './vite-config.js';

vi.doMock('@remix-run/dev/dist/config.js', () => {
  return {
    resolveConfig: () =>
      Promise.resolve({
        appDirectory: '/Users/ryan/Projects/remix-pwa/app',
        routes: {},
        assetsBuildDirectory: '/Users/ryan/Projects/remix-pwa/public/build',
        ignoredRouteFiles: ['**/.*'],
        publicPath: '/build/',
      } as unknown as ResolvedRemixConfig),
    findConfig: () => './__test__/vite-config.ts',
  };
});
vi.doMock('path', () => {
  return {
    resolve: (...args: string[]) => args.join('/'),
    normalize: (path: string) => path,
  };
});

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

    createContext();

    expect(createContext).toHaveBeenCalled();
    expect(createContext).toHaveBeenCalledWith();
  });

  afterAll(() => {
    vi.doUnmock('../context.js');
  });
});

describe('Plugin resolver test suite', () => {
  // beforeEach(() => {
  //   vi.doMock('../resolver.js', () => {
  //     return {
  //       resolveOptions: (opts: Partial<PWAOptions>, config: ResolvedConfig) =>
  //         Promise.resolve({ ...opts, config } as unknown as ResolvedPWAOptions),
  //     };
  //   });
  // });

  test('should resolve options', async () => {
    const { resolveOptions } = await import('../resolver.js');

    const options = await resolveOptions({}, mockViteConfig as ResolvedConfig);

    assert(options);
    expect(options).toEqual(<ResolvedPWAOptions>{
      workerBuildDirectory: '/Users/ryan/Projects/remix-pwa/build/client',
      registerSW: 'script',
      buildVariables: {
        'process.env.NODE_ENV': 'production',
        'process.env.__REMIX_PWA_SPA_MODE': 'false',
      },
      workerSourceMap: false,
      publicPath: '/build/',
      entryWorkerFile: 'entry.worker.ts',
      workerEntryPoint: '@remix-pwa/worker-runtime',
      scope: '/',
      rootDirectory: '/Users/ryan/Projects/remix-pwa',
      appDirectory: '/Users/ryan/Projects/remix-pwa/app',
      ignoredSWRouteFiles: [],
      workerMinify: false,
      workerName: 'entry.worker',
      serviceWorkerPath: '/Users/ryan/Projects/remix-pwa/app/entry.worker.ts',
      routes: {},
    });
  });

  test('should resolve options with user options', async () => {
    const { resolveOptions } = await import('../resolver.js');

    const options = await resolveOptions(
      {
        workerMinify: true,
        workerBuildDirectory: 'public',
        registerSW: null,
        scope: '/pwa',
      },
      mockViteConfig as ResolvedConfig
    );

    assert(options);
    expect(options).toEqual(<ResolvedPWAOptions>{
      workerBuildDirectory: '/Users/ryan/Projects/remix-pwa/public',
      registerSW: null,
      scope: '/pwa',
      buildVariables: {
        'process.env.NODE_ENV': 'production',
        'process.env.__REMIX_PWA_SPA_MODE': 'false',
      },
      rootDirectory: '/Users/ryan/Projects/remix-pwa',
      appDirectory: '/Users/ryan/Projects/remix-pwa/app',
      ignoredSWRouteFiles: [],
      entryWorkerFile: 'entry.worker.ts',
      publicPath: '/build/',
      workerEntryPoint: '@remix-pwa/worker-runtime',
      workerSourceMap: false,
      workerMinify: true,
      workerName: 'entry.worker',
      serviceWorkerPath: '/Users/ryan/Projects/remix-pwa/app/entry.worker.ts',
      routes: {},
    });
  });

  test('should trim weird file paths provided by user', async () => {
    const { resolveOptions } = await import('../resolver.js');

    const options = await resolveOptions(
      {
        entryWorkerFile: '/entry.worker.ts',
        workerBuildDirectory: '/out/dist/',
      },
      mockViteConfig as ResolvedConfig
    );

    assert(options);
    expect(options).toEqual(<ResolvedPWAOptions>{
      workerBuildDirectory: '/Users/ryan/Projects/remix-pwa/out/dist',
      registerSW: 'script',
      workerSourceMap: false,
      publicPath: '/build/',
      buildVariables: {
        'process.env.NODE_ENV': 'production',
        'process.env.__REMIX_PWA_SPA_MODE': 'false',
      },
      entryWorkerFile: 'entry.worker.ts',
      workerEntryPoint: '@remix-pwa/worker-runtime',
      scope: '/',
      rootDirectory: '/Users/ryan/Projects/remix-pwa',
      appDirectory: '/Users/ryan/Projects/remix-pwa/app',
      ignoredSWRouteFiles: [],
      workerMinify: false,
      workerName: 'entry.worker',
      serviceWorkerPath: '/Users/ryan/Projects/remix-pwa/app/entry.worker.ts',
      routes: {},
    });
  });

  test('should inject user-defined variables', async () => {
    const { resolveOptions } = await import('../resolver.js');

    const options = await resolveOptions(
      {
        entryWorkerFile: '/entry.worker.ts',
        buildVariables: {
          'process.env.__REMIX_PWA_SPA_MODE': 'false',
          'process.env.API_URL': 'https://api.example.com',
        },
        workerBuildDirectory: '/out/dist/',
      },
      mockViteConfig as ResolvedConfig
    );

    assert(options);
    expect(options).toEqual(<ResolvedPWAOptions>{
      workerBuildDirectory: '/Users/ryan/Projects/remix-pwa/out/dist',
      registerSW: 'script',
      workerSourceMap: false,
      publicPath: '/build/',
      buildVariables: {
        'process.env.__REMIX_PWA_SPA_MODE': 'false',
        'process.env.API_URL': 'https://api.example.com',
      },
      entryWorkerFile: 'entry.worker.ts',
      workerEntryPoint: '@remix-pwa/worker-runtime',
      scope: '/',
      rootDirectory: '/Users/ryan/Projects/remix-pwa',
      appDirectory: '/Users/ryan/Projects/remix-pwa/app',
      ignoredSWRouteFiles: [],
      workerMinify: false,
      workerName: 'entry.worker',
      serviceWorkerPath: '/Users/ryan/Projects/remix-pwa/app/entry.worker.ts',
      routes: {},
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.doUnmock('../resolver.js');
    vi.doUnmock('@remix-run/dev/dist/config');
    vi.doUnmock('path');
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
