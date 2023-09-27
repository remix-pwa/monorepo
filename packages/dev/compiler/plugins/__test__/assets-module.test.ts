import type { ResolvedWorkerConfig } from '@remix-pwa/dev/dist/compiler/utils/config';
import type { OnLoadArgs, PluginBuild } from 'esbuild';
import type { MockedObject } from 'vitest';
import { afterAll, beforeEach, describe, expect, test, vi } from 'vitest';

const mockGlob = vi.fn();
vi.doMock('glob', () => ({ glob: mockGlob }));

describe('assets-module plugin', () => {
  const config = {
    rootDirectory: '/root/',
    assetsBuildDirectory: '/path/to/assets',
    publicPath: 'public/build',
  } as ResolvedWorkerConfig;

  beforeEach(() => {
    mockGlob.mockClear();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  test('should return an esbuild plugin object', async () => {
    const { default: assetsModulePlugin } = await import('../assets-module');
    const plugin = assetsModulePlugin(config);
    expect(plugin).toHaveProperty('name', 'sw-assets-module');
    expect(plugin).toHaveProperty('setup');
  });

  test('should transform the assets module if it matches the filter regex', async () => {
    const { default: assetsModulePlugin } = await import('../assets-module');
    const plugin = assetsModulePlugin(config);
    const build: PluginBuild = {
      onResolve: vi.fn(),
      onLoad: vi.fn(),
    } as unknown as PluginBuild;
    await plugin.setup(build);
    expect(build.onResolve).toHaveBeenCalledWith({ filter: /@remix-pwa\/dev\?assets/ }, expect.any(Function));
    expect(build.onLoad).toHaveBeenCalledWith(
      { filter: /@remix-pwa\/dev\?assets/, namespace: 'assets-module' },
      expect.any(Function)
    );
  });

  test('loads the assets module with the correct contents and loader', async () => {
    const files = ['/path/to/assets/file1.js', '/path/to/assets/file2.js'];
    mockGlob.mockResolvedValue(files);
    const { default: assetsModulePlugin } = await import('../assets-module');
    const plugin = assetsModulePlugin(config);
    const build = {
      onResolve: vi.fn(),
      onLoad: vi.fn(),
    } as unknown as MockedObject<PluginBuild>;
    await plugin.setup(build);
    const onLoadCallback = build.onLoad.mock.calls[0][1];
    const result = await onLoadCallback({} as OnLoadArgs);
    expect(result).toHaveProperty('contents');
    expect(result?.contents).toContain(
      `export const assets = ${JSON.stringify([
        'public/build/path/to/assets/file1.js',
        'public/build/path/to/assets/file2.js',
      ])};`
    );
    expect(result).toHaveProperty('loader', 'js');
    expect(mockGlob).toHaveBeenCalledWith('**/*', {
      ignore: '**/*.map',
      absolute: false,
      nodir: true,
      root: '/root/',
      cwd: '/path/to/assets',
    });
  });
});
