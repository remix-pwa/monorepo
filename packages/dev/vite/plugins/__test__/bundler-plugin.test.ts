import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import { afterAll, afterEach, assert, beforeEach, describe, expect, test, vi } from 'vitest';

import type { PWAPluginContext } from '../../types';

vi.mock('vite', () => ({
  build: vi.fn(),
  watch: vi.fn(),
}));

vi.mock('rollup-plugin-esbuild', () => vi.fn());
vi.mock('@rollup/plugin-node-resolve', () => vi.fn());
vi.mock('@rollup/plugin-commonjs', () => vi.fn());
vi.mock('../virtual-sw.js', () => vi.fn());
vi.mock('../../hash.js', () => ({
  getWorkerHash: vi.fn(),
}));

describe('Remix PWA Vite Bundler Plugin', () => {
  let plugin: any;
  let mockPWAContext: PWAPluginContext;
  let mockedBuild;
  let mockedWatch;

  beforeEach(async () => {
    mockPWAContext = {
      isDev: true,
      isRemixDevServer: true,
    } as unknown as PWAPluginContext;

    const _plugin = (await import('../bundler')).BundlerPlugin;
    plugin = _plugin(mockPWAContext);
  });

  describe('Plugin configuration suite', () => {
    test('should return a plugin object', () => {
      expect(plugin).not.toBe(null);
      expect(plugin).toBeTypeOf('object');
    });

    test('should have the correct name', () => {
      expect(plugin.name).toBe('vite-plugin-remix-pwa:bundler');
    });

    test('should have a buildStart hook', () => {
      expect(plugin.buildStart).toBeTypeOf('function');
    });

    test('should have a configureServer hook', () => {
      expect(plugin.configureServer).toBeTypeOf('function');
    });
  });

  describe('buildStart hook suite', () => {
    test('should not do anything if not in a Remix dev server', () => {
      mockPWAContext.isRemixDevServer = false;

      const buildStartSpy = vi.spyOn(plugin, 'buildStart');

      plugin.buildStart();

      expect(buildStartSpy).toHaveReturnedWith(undefined);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();
  });
});
