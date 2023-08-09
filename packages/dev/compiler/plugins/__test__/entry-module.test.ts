import type { PluginBuild } from 'esbuild';
import { describe, expect, test, vi } from 'vitest';

import type { ResolvedWorkerConfig } from '../../utils/config.js';
import entryModulePlugin from '../entry-module.js';

describe('entryModulePlugin', () => {
  const config = {
    appDirectory: '/path/to/app',
    entryWorkerFile: 'entry-worker.js',
    routes: {
      '/': { id: 'home', file: 'routes/home.js', path: '/' },
      '/about': { id: 'about', file: 'routes/about.js', path: '/about' },
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
    expect(build.onResolve).toHaveBeenCalledWith({ filter: /@remix-pwa\/dev\/worker-build$/ }, expect.any(Function));
    expect(build.onLoad).toHaveBeenCalledWith(
      { filter: /@remix-pwa\/dev\/worker-build$/, namespace: 'entry-module' },
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

    expect(result).toHaveProperty(
      'contents',
      expect.stringContaining(
        '\n' +
          "    import * as route0 from 'routes/home.js?worker';\n" +
          "import * as route1 from 'routes/about.js?worker'\n" +
          '\n' +
          '    export const routes = [\n' +
          '      { file: "routes/home.js", path: "/", module: route0, id: "home", parentId: "undefined", },\n' +
          '{ file: "routes/about.js", path: "/about", module: route1, id: "about", parentId: "undefined", }\n' +
          '    ];\n' +
          '\n' +
          "    import * as entryWorker from  'entry-worker.js?user';\n" +
          '    export const entry = { module: entryWorker };\n' +
          '    '
      )
    );
  });
});
