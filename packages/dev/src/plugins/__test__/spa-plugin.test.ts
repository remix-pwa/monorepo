import { afterAll, afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import type { PWAPluginContext } from '../../types';

describe('Remix PWA Vite SPA Plugin', () => {
  let mockContext: PWAPluginContext;
  let plugin: any;

  beforeEach(async () => {
    mockContext = {
      options: {
        registerSW: 'script',
        workerName: 'worker',
        scope: '/',
      },
      isRemixDevServer: true,
      __remixPluginContext: {
        remixConfig: {
          buildDirectory: '/build/',
          ssr: false,
        },
      },
    } as PWAPluginContext;

    const _plugin = (await import('../spa')).SPAPlugins;
    plugin = _plugin(mockContext);
  });

  describe('Fetch Override Plugin', () => {
    test('should return a plugin object', () => {
      expect(plugin[0]).not.toBe(null);
      expect(plugin[0]).toBeTypeOf('object');
    });

    test('should have the correct name', () => {
      expect(plugin[0].name).toBe('vite-plugin-remix-pwa:spa-fetch-override');
    });

    test('should enforce plugin before core plugins', () => {
      expect(plugin[0].enforce).toBe('pre');
    });

    test('should be able to transform code', () => {
      expect(plugin[0].transform).toBeTypeOf('function');
      expect(plugin[0].transform.length).toBe(2);
    });

    test('should not transform non-target code', () => {
      const code = 'console.log("Hello World!")';
      const id = 'root.tsx';

      const transformed = plugin[0].transform(code, id);

      expect(transformed).toBe(code);
    });

    test('should transform target code', () => {
      const code = '</head>';
      const id = 'root.tsx';

      const transformed = plugin[0].transform(code, id);

      expect(transformed).toContain('vite-plugin-remix-pwa:spa::fetch-override');
      expect(transformed).toContain('return $_o.call(this,');
    });

    test('should not transform target code when Remix SSR is enabled', async () => {
      mockContext.__remixPluginContext.remixConfig = {
        ...mockContext.__remixPluginContext.remixConfig,
        ssr: true,
      };

      const _plugin = (await import('../spa')).SPAPlugins;
      plugin = _plugin(mockContext as PWAPluginContext);

      const code = '</head>';
      const id = 'root.tsx';

      console.log(plugin);

      const transformed = plugin[0].transform(code, id);

      expect(transformed).toBe(undefined);
    });

    test('should not transform target code when id does not match', () => {
      const code = '</head>';
      const id = 'index.tsx';

      const transformed = plugin[0].transform(code, id);

      expect(transformed).toBe(undefined);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });
});
