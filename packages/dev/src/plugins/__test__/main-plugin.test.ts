import { afterAll, afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import type { PWAOptions, PWAPluginContext } from '../../types';

// (ShafSpecs): Mocking this because test for resolvers already available
// at packages/dev/vite/__test__/utils.test.ts
vi.doMock('../../resolver.js', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resolveOptions: (_opts: Partial<PWAOptions>, _config: any) => {
      return {
        registerSW: 'script',
        workerName: 'service-worker',
        scope: '/',
      };
    },
  };
});

describe('Remix PWA Vite Main Plugin', () => {
  let plugin: any;
  let mockContext: PWAPluginContext;
  let mockPWAOptions: Partial<PWAOptions>;
  let mockViteConfig: any;

  beforeEach(async () => {
    mockContext = {
      isDev: undefined,
      isRemixDevServer: undefined,
      viteConfig: undefined,
      __remixPluginContext: undefined,
      options: undefined,
    } as unknown as PWAPluginContext;
    mockPWAOptions = {
      registerSW: 'script',
    };
    mockViteConfig = {
      mode: 'development',
      __remixPluginContext: {},
    };

    const _plugin = (await import('../main')).EntryPlugin;
    plugin = _plugin(mockContext, mockPWAOptions);
  });

  describe('Plugin configuration suite', () => {
    test('should return a plugin object', () => {
      expect(plugin).not.toBe(null);
      expect(plugin).toBeTypeOf('object');
    });

    test('should have the correct name', () => {
      expect(plugin.name).toBe('vite-plugin-remix-pwa:entry');
    });

    test('should enforce pre-transform', () => {
      expect(plugin.enforce).toBe('pre');
    });

    test('should have a configResolved hook', () => {
      expect(plugin.configResolved).toBeTypeOf('function');
    });

    test('configResolved hook should have the correct length', () => {
      expect(plugin.configResolved.length).toBe(1);
    });
  });

  describe('configResolved hook suite', () => {
    test('should set isDev to true when mode is development', async () => {
      await plugin.configResolved(mockViteConfig);

      expect(mockContext.isDev).toBe(false);
    });

    test('should set isDev to false when mode is not development', async () => {
      mockViteConfig.mode = 'production';

      await plugin.configResolved(mockViteConfig);

      expect(mockContext.isDev).toBe(false);
    });

    test('should set isRemixDevServer to true when __remixPluginContext is defined', async () => {
      await plugin.configResolved(mockViteConfig);

      expect(mockContext.isRemixDevServer).toBe(true);
    });

    test('should set isRemixDevServer to false when __remixPluginContext is not defined', async () => {
      mockViteConfig.__remixPluginContext = undefined;

      await plugin.configResolved(mockViteConfig);

      expect(mockContext.isRemixDevServer).toBe(false);
    });

    test('should set viteConfig to the config object', async () => {
      await plugin.configResolved(mockViteConfig);

      expect(mockContext.viteConfig).toBe(mockViteConfig);
    });

    test('should set __remixPluginContext to the remix plugin context object', async () => {
      await plugin.configResolved(mockViteConfig);

      expect(mockContext.__remixPluginContext).toBe(mockViteConfig.__remixPluginContext);
    });

    test('should set options to the resolved options', async () => {
      await plugin.configResolved(mockViteConfig);

      expect(mockContext.options).toEqual({
        registerSW: 'script',
        workerName: 'service-worker',
        scope: '/',
      });
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.clearAllMocks();
    vi.doUnmock('../../resolver.js');
  });
});
