import type { PluginBuild } from 'esbuild';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

import type { ResolvedEsbuildConfig } from '../../types';

vi.doMock('fs/promise', () => {
  return {
    readFile: vi.fn(
      async () => `
      export const workerAction = () => {};
      export const otherExport = () => {};
    `
    ),
  };
});

const mockGetRouteModuleExports = vi.hoisted(() => vi.fn());
vi.doMock('@remix-run/dev/dist/compiler/utils/routeExports', () => ({
  getRouteModuleExports: mockGetRouteModuleExports,
}));

describe('routesModulesPlugin', () => {
  const config = {
    appDirectory: '/path/to/app',
    routes: {
      '/': { id: 'home', file: 'routes/home.js' },
      '/about': { id: 'about', file: 'routes/about.js' },
    },
  } as unknown as ResolvedEsbuildConfig;

  beforeAll(() => {
    vi.doMock('../babel.js', () => {
      return {
        parse: vi.fn().mockReturnValue(''),
      };
    });
  });

  test('should return an esbuild plugin object', async () => {
    const { default: routesModulesPlugin } = await import('../routes-plugin.js');
    const plugin = routesModulesPlugin(config);

    expect(plugin).toHaveProperty('name', 'sw-routes-modules');
    expect(plugin).toHaveProperty('setup');
  });

  test('should transform modules that match the filter regex', async () => {
    const { default: routesModulesPlugin } = await import('../routes-plugin.js');
    const plugin = routesModulesPlugin(config);
    const build = {
      onResolve: vi.fn(),
      onLoad: vi.fn(),
    } as unknown as PluginBuild;

    await plugin.setup(build);

    expect(build.onResolve).toHaveBeenCalledWith({ filter: /\?worker$/ }, expect.any(Function));
    expect(build.onLoad).toHaveBeenCalledWith(
      { filter: /\?worker$/, namespace: 'routes-module' },
      expect.any(Function)
    );
  });

  test.skip('should generate a new module with workerAction and workerLoader exports', async () => {
    vi.doMock('fs/promise', () => {
      return {
        readFile: vi.fn(
          async () => `
            export const workerAction = () => {};
            export const workerLoader = () => {};
            export const otherExport = () => {};
            export default function() {};
          `
        ),
      };
    });
    vi.doMock('@remix-run/dev/dist/compiler/utils/routeExports');
    mockGetRouteModuleExports.mockResolvedValue(['default', 'workerAction', 'workerLoader']);

    const { default: routesModulesPlugin } = await import('../routes-plugin.js');

    const build = {
      onResolve: vi.fn(),
      onLoad: vi.fn(async ({ path }) => {
        if (path === 'routes/home.js?worker') {
          return {
            contents: `
              export const workerAction = () => {};
              export const otherExport = () => {};
            `,
            resolveDir: '/path/to/app',
            loader: 'js',
          };
        }
      }),
    } as unknown as PluginBuild;
    const plugin = routesModulesPlugin(config);

    await plugin.setup(build);

    // @ts-ignore
    const onLoadCallback = build.onLoad.mock.calls[0][1];
    const result = await onLoadCallback({ path: 'routes/home.js?worker' });

    expect(result.contents).toMatchInlineSnapshot('"export const workerAction = () => {};"');
    expect(result).not.toHaveProperty('contents', expect.stringContaining('otherExport'));
  });

  test.skip('should not generate a new module if there are no workerAction or workerLoader exports', async () => {
    mockGetRouteModuleExports.mockResolvedValue(['default', 'action', 'loader']);

    const { default: routesModulesPlugin } = await import('../routes-plugin.js');

    const plugin = routesModulesPlugin(config);
    const build = {
      onResolve: vi.fn(),
      onLoad: vi.fn(async ({ path }) => {
        if (path === 'routes/about.js?worker') {
          return {
            contents: `
              export const otherExport = () => {};
            `,
            resolveDir: '/path/to/app',
            loader: 'js',
          };
        }
      }),
    } as unknown as PluginBuild;

    await plugin.setup(build);

    // @ts-ignore
    const onLoadCallback = build.onLoad.mock.calls[0][1];
    const result = await onLoadCallback({ path: 'routes/about.js?worker' });
    expect(result).toHaveProperty('contents', 'module.exports = {};');
  });

  afterEach(() => {
    vi.clearAllMocks();
    // vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.unmock('fs/promise');
    vi.unmock('../babel.js');
    vi.unmock('@remix-run/dev/dist/compiler/utils/routeExports.js');

    vi.doUnmock('fs/promise');
    vi.doUnmock('../babel.js');
    vi.doUnmock('@remix-run/dev/dist/compiler/utils/routeExports.js');
  });
});
