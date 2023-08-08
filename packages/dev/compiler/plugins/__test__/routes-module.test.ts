import { jest } from '@jest/globals';
import { getRouteModuleExports } from '@remix-run/dev/dist/compiler/utils/routeExports.js';
import type { PluginBuild } from 'esbuild';

import type { ResolvedWorkerConfig } from '../../utils/config';

jest.mock('@remix-run/dev/dist/compiler/utils/routeExports');

const mockGetRouteModuleExports = jest.mocked(getRouteModuleExports);

describe('routesModulesPlugin', () => {
  const config = {
    appDirectory: '/path/to/app',
    routes: {
      '/': { id: 'home', file: 'routes/home.js' },
      '/about': { id: 'about', file: 'routes/about.js' },
    },
  } as unknown as ResolvedWorkerConfig;
  beforeEach(() => {
    mockGetRouteModuleExports.mockReset();
  });
  afterAll(() => {
    jest.unmock('@remix-run/dev/dist/compiler/utils/routeExports.js');
  });

  it('should return an esbuild plugin object', async () => {
    const { default: routesModulesPlugin } = await import('../routes-module');
    const plugin = routesModulesPlugin(config);
    expect(plugin).toHaveProperty('name', 'sw-routes-modules');
    expect(plugin).toHaveProperty('setup');
  });

  it('should transform modules that match the filter regex', async () => {
    const { default: routesModulesPlugin } = await import('../routes-module');
    const plugin = routesModulesPlugin(config);
    const build = {
      onResolve: jest.fn(),
      onLoad: jest.fn(),
    } as unknown as PluginBuild;
    await plugin.setup(build);
    expect(build.onResolve).toHaveBeenCalledWith({ filter: /\?worker$/ }, expect.any(Function));
    expect(build.onLoad).toHaveBeenCalledWith(
      { filter: /\?worker$/, namespace: 'routes-module' },
      expect.any(Function)
    );
  });

  it('should generate a new module with workerAction and workerLoader exports', async () => {
    mockGetRouteModuleExports.mockResolvedValue(['default', 'workerAction', 'workerLoader']);
    const { default: routesModulesPlugin } = await import('../routes-module');
    const plugin = routesModulesPlugin(config);
    const build = {
      onResolve: jest.fn(),
      onLoad: jest.fn(async ({ path }) => {
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
    await plugin.setup(build);
    // @ts-ignore
    const onLoadCallback = build.onLoad.mock.calls[0][1];
    const result = await onLoadCallback({ path: 'routes/home.js?worker' });

    expect(result).toHaveProperty(
      'contents',
      expect.stringContaining(
        'export { workerAction, workerLoader } from "./routes/home.js";\n' +
          '          export const hasWorkerAction = true;\n' +
          '          export const hasWorkerLoader = true'
      )
    );
    expect(result).not.toHaveProperty('contents', expect.stringContaining('otherExport'));
  });

  it('should not generate a new module if there are no workerAction or workerLoader exports', async () => {
    mockGetRouteModuleExports.mockResolvedValue(['default', 'action', 'loader']);
    const { default: routesModulesPlugin } = await import('../routes-module');
    const plugin = routesModulesPlugin(config);
    const build = {
      onResolve: jest.fn(),
      onLoad: jest.fn(async ({ path }) => {
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
});
