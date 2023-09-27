import type { PluginBuild } from 'esbuild';
import { describe, expect, test, vi } from 'vitest';

import type { ResolvedWorkerConfig } from '../../utils/config.js';
import sideEffectsPlugin from '../side-effects.js';

describe('sideEffectsPlugin', () => {
  const config: ResolvedWorkerConfig = {
    entryWorkerFile: 'entry-worker.js',
  } as unknown as ResolvedWorkerConfig;
  test('should return an esbuild plugin object', () => {
    const plugin = sideEffectsPlugin(config);
    expect(plugin).toHaveProperty('name', 'sw-side-effects');
    expect(plugin).toHaveProperty('setup');
  });

  test('should transform modules that match the filter regex', async () => {
    const plugin = sideEffectsPlugin(config);
    const build = {
      onResolve: vi.fn(),
      onLoad: vi.fn(),
    } as unknown as PluginBuild;
    await plugin.setup(build);
    expect(build.onResolve).toHaveBeenCalledWith({ filter: /\?user$/ }, expect.any(Function));
    expect(build.onLoad).toHaveBeenCalledWith({ filter: /\?user$/ }, expect.any(Function));
  });

  test('should set sideEffects to true for modules that match the filter regex', async () => {
    const plugin = sideEffectsPlugin(config);
    const build = {
      onResolve: vi.fn(),
      onLoad: vi.fn(),
    } as unknown as PluginBuild;
    await plugin.setup(build);
    // @ts-ignore
    const onResolveCallback = build.onResolve.mock.calls[0][1];
    const result = onResolveCallback({ path: '/path/to/module.js?user' });
    expect(result).toHaveProperty('sideEffects', true);
  });

  test('should set the loader to "js" for modules that match the filter regex', async () => {
    const plugin = sideEffectsPlugin(config);
    const build = {
      onResolve: vi.fn(),
      onLoad: vi.fn(),
    } as unknown as PluginBuild;
    await plugin.setup(build);
    // @ts-ignore
    const onLoadCallback = build.onLoad.mock.calls[0][1];
    const result = await onLoadCallback({ path: '/path/to/module.js?user' });
    expect(result).toHaveProperty('loader', 'js');
  });
});
