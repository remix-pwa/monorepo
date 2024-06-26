import { afterAll, afterEach, assert, beforeEach, describe, expect, test, vi } from 'vitest';

import type { PWAPluginContext } from '../../types';

describe('Remix PWA Vite Loader Plugin', () => {
  let mockContext: PWAPluginContext;
  let plugin: any;

  beforeEach(async () => {
    mockContext = {
      options: {
        registerSW: 'script',
        workerName: 'worker',
        scope: '/',
      },
    } as PWAPluginContext;

    const _plugin = (await import('../loader')).LoaderPlugin;
    plugin = _plugin(mockContext);
  });

  describe('Plugin configuration suite', () => {
    test('should return a plugin object', () => {
      assert(plugin);
      expect(plugin).not.toBe(null);
      expect(plugin).toBeTypeOf('object');
    });

    test('should have the correct name', () => {
      expect(plugin.name).toBe('vite-plugin-remix-pwa:loader');
    });

    test('should enforce pre-transform', () => {
      expect(plugin.enforce).toBe('pre');
    });

    test('should be able to transform code', () => {
      expect(plugin.transform).toBeTypeOf('function');
      expect(plugin.transform.length).toBe(2);
    });
  });

  describe('Code transformation suite', () => {
    test('should not transform non-target code', () => {
      const code = 'console.log("Hello World!")';
      const id = 'root.tsx';

      const transformed = plugin.transform(code, id);

      expect(transformed).toBe(code);
    });

    test('should transform target code', () => {
      const code = '</head>';
      const id = 'root.tsx';

      const transformed = plugin.transform(code, id);

      expect(transformed).toContain('vite-plugin-remix-pwa:loader::inject-sw');
      expect(transformed).toContain('register();');
    });

    test('should not transform target code when registerSW is not script', async () => {
      mockContext.options.registerSW = null;

      const _plugin = (await import('../loader')).LoaderPlugin;
      plugin = _plugin(mockContext as PWAPluginContext);

      const code = '</head>';
      const id = 'root.tsx';

      const transformed = plugin.transform(code, id);

      expect(transformed).toBe(undefined);
    });

    test('should not transform target code when id does not match', () => {
      const code = '</head>';
      const id = 'index.tsx';

      const transformed = plugin.transform(code, id);

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
