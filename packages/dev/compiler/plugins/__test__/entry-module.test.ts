import type { PluginBuild } from 'esbuild';
import { describe, expect, test, vi } from 'vitest';

import type { ResolvedWorkerConfig } from '../../utils/config.js';
import entryModulePlugin from '../entry-module.js';

describe('entry-module plugin', () => {
  const config = {
    appDirectory: '/path/to/app',
    entryWorkerFile: 'entry-worker.js',
    routes: {
      '/': { id: '/', file: 'routes/home.js', path: '/' },
      '/about': { id: '/about', file: 'routes/about.js', path: '/about' },
    },
  } as unknown as ResolvedWorkerConfig;

  test('should return an esbuild plugin object', () => {
    const plugin = entryModulePlugin(config);
    expect(plugin).toHaveProperty('name', 'sw-entry-module');
    expect(plugin).toHaveProperty('setup');
  });

  test('should transform the entry module if it matches the filter regex', async () => {
    const plugin = entryModulePlugin(config);
    const build = {
      onResolve: vi.fn(),
      onLoad: vi.fn(),
    } as unknown as PluginBuild;
    await plugin.setup(build);
    expect(build.onResolve).toHaveBeenCalledWith({ filter: /@remix-pwa\/build\/magic$/ }, expect.any(Function));
    expect(build.onLoad).toHaveBeenCalledWith(
      { filter: /@remix-pwa\/build\/magic$/, namespace: 'entry-module' },
      expect.any(Function)
    );
  });

  test('should inject the routes and entry worker into the entry module', async () => {
    const plugin = entryModulePlugin(config);
    const build = {
      onResolve: vi.fn(),
      onLoad: vi.fn(async ({ path }) => {
        if (path === '/path/to/app/entry.js@remix-pwa/dev/worker-build') {
          return {
            contents: `
              import * as someOtherModule from './some-other-module';
              export const someExport = () => {};
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
    const result = await onLoadCallback({ path: '/path/to/app/entry.js@remix-pwa/dev/worker-build' });

    expect(result).toHaveProperty('contents');
    expect(result.contents).toMatchInlineSnapshot(`
      "
            import * as entryWorker from \\"entry-worker.js\\";

          import * as route0 from \\"routes/home.js?worker\\";
      import * as route1 from \\"routes/about.js?worker\\";

          export const routes = {
            \\"/\\": {
                id: \\"/\\",
                parentId: undefined,
                path: \\"/\\",
                index: undefined,
                caseSensitive: undefined,
                module: route0
              },
      \\"/about\\": {
                id: \\"/about\\",
                parentId: undefined,
                path: \\"/about\\",
                index: undefined,
                caseSensitive: undefined,
                module: route1
              }
          };

          export { assets } from '@remix-pwa/dev?assets';
          export const entry = { module: entryWorker };
          "
    `);
  });
});
