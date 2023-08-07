import { jest } from '@jest/globals';
import sideEffectsPlugin from '../side-effects';
import { PluginBuild } from 'esbuild';

describe('sideEffectsPlugin', () => {
  it('should return an esbuild plugin object', () => {
    const plugin = sideEffectsPlugin();
    expect(plugin).toHaveProperty('name', 'sw-side-effects');
    expect(plugin).toHaveProperty('setup');
  });

  it('should transform modules that match the filter regex', async () => {
    const plugin = sideEffectsPlugin();
    const build = {
      onResolve: jest.fn(),
      onLoad: jest.fn(),
    } as unknown as PluginBuild;
    await plugin.setup(build);
    expect(build.onResolve).toHaveBeenCalledWith({ filter: /\?user$/ }, expect.any(Function));
    expect(build.onLoad).toHaveBeenCalledWith({ filter: /\?user$/ }, expect.any(Function));
  });

  it('should set sideEffects to true for modules that match the filter regex', async () => {
    const plugin = sideEffectsPlugin();
    const build = {
      onResolve: jest.fn(),
      onLoad: jest.fn(),
    } as unknown as PluginBuild;
    await plugin.setup(build);
    // @ts-ignore
    const onResolveCallback = build.onResolve.mock.calls[0][1];
    const result = onResolveCallback({ path: '/path/to/module.js?user' });
    expect(result).toHaveProperty('sideEffects', true);
  });

  it('should set the loader to "js" for modules that match the filter regex', async () => {
    const plugin = sideEffectsPlugin();
    const build = {
      onResolve: jest.fn(),
      onLoad: jest.fn(),
    } as unknown as PluginBuild;
    await plugin.setup(build);
    // @ts-ignore
    const onLoadCallback = build.onLoad.mock.calls[0][1];
    const result = await onLoadCallback({ path: '/path/to/module.js?user' });
    expect(result).toHaveProperty('loader', 'js');
  });
});
