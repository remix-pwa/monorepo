import type { Context } from '@remix-run/dev/dist/compiler/context.js';
import { whiteBright } from 'colorette';
import type { BuildOptions, Plugin as EsbuildPlugin } from 'esbuild';
import { context } from 'esbuild';
import type { FSWatcher, Plugin } from 'vite';
import type { PWAPluginContext } from 'vite/types.js';

import assetsPlugin from '../esbuild/assets-plugin.js';
import { emptyModulesPlugin } from '../esbuild/empty-plugin.js';
import entryModulePlugin from '../esbuild/entry-plugin.js';
import routesModulesPlugin from '../esbuild/routes-plugin.js';
import sideEffectsPlugin from '../esbuild/side-effects.js';

export function CompilerPlugin(ctx: PWAPluginContext): Plugin {
  let watcher: FSWatcher | null = null;
  let viteCommand: 'serve' | 'build';

  return <Plugin>{
    name: 'vite-plugin-remix-pwa:compiler',
    config(_config, configEnv) {
      viteCommand = configEnv.command;
    },
    // development only
    configureServer({ watcher: viteWatcher, ws }) {
      const esbuildOptions: BuildOptions = {
        absWorkingDir: ctx.options.rootDirectory,
        entryPoints: {
          [ctx.options.workerName]: ctx.options.workerEntryPoint,
        },
        write: true,
        color: true,
        metafile: true,
        bundle: true,
        platform: 'browser',
        format: 'esm',
        logLevel: 'error',
        splitting: true,
        treeShaking: true,
        outdir: ctx.options.workerBuildDirectory,
        minify: ctx.options.workerMinify,
        sourcemap: ctx.options.workerSourceMap,
        mainFields: ['browser', 'module', 'main'],
        chunkNames: '_shared/sw/[name]-[hash]',
        define: {
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        },
        supported: {
          'import-meta': true,
        },
      };

      watcher = viteWatcher;

      const esbuildPluginContext = { config: ctx.options } as unknown as Context;

      console.log(viteCommand, process.env.NODE_ENV);

      console.time('💿 Built Service Worker in');

      context({
        ...esbuildOptions,
        plugins: [
          emptyModulesPlugin(esbuildPluginContext, /\.server(\.[jt]sx?)?$/) as EsbuildPlugin,
          emptyModulesPlugin(esbuildPluginContext, /^react(-dom)?(\/.*)?$/, {
            includeNodeModules: true,
          }) as EsbuildPlugin,
          emptyModulesPlugin(esbuildPluginContext, /^@remix-run\/(deno|cloudflare|node|react)(\/.*)?$/, {
            includeNodeModules: true,
          }) as EsbuildPlugin,
          entryModulePlugin(ctx.options),
          routesModulesPlugin(ctx.options),
          assetsPlugin(ctx.options),
          sideEffectsPlugin(ctx.options),
        ],
      }).then(async context => {
        if (process.env.NODE_ENV === 'production') {
          console.log(whiteBright('🏗️ Building Service Worker in production mode...\n'));

          await context.rebuild();
          console.log('🎉 Service Worker built successfully!');
          console.timeEnd('💿 Built Service Worker in');

          return await context.dispose();
        }

        console.log(whiteBright('🏗️ Building Service Worker in development mode...\n'));
      });

      // viteWatcher.on('add', path => {});
    },
    closeBundle() {
      if (watcher) {
        watcher.close();
      }
    },
  };
}
