import type { Context } from '@remix-run/dev/dist/compiler/context.js';
import { red, whiteBright } from 'colorette';
import type { BuildOptions, Plugin as EsbuildPlugin } from 'esbuild';
import { context } from 'esbuild';
import type { Plugin } from 'vite';
import type { PWAPluginContext } from 'vite/types.js';

import assetsPlugin from '../esbuild/assets-plugin.js';
import { emptyModulesPlugin } from '../esbuild/empty-plugin.js';
import entryModulePlugin from '../esbuild/entry-plugin.js';
import routesModulesPlugin from '../esbuild/routes-plugin.js';
import sideEffectsPlugin from '../esbuild/side-effects.js';
import { compareHash, getWorkerHash } from '../hash.js';

export function CompilerPlugin(ctx: PWAPluginContext): Plugin {
  return <Plugin>{
    name: 'vite-plugin-remix-pwa:compiler',
    async configureServer({ config, watcher: viteWatcher, ws }) {
      // Disable Remix PWA during Remix Dev Server run
      if (config.appType === 'custom') {
        return;
      }

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

      const MODE = process.env.NODE_ENV === 'production' ? 'production' : 'development';
      const TIME_LABEL = '💿 Built Service Worker in';
      const DEV_TIME_LABEL = '💿 Re-built Service Worker in';
      const esbuildPluginContext = { config: ctx.options } as unknown as Context;

      let hash = '';

      console.time(TIME_LABEL);

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
        if (MODE === 'production') {
          console.log(whiteBright(`🏗️ Building Service Worker in ${MODE} mode...\n`));

          await context.rebuild();

          console.log('\n🎉 Service Worker built successfully!');
          console.timeEnd(TIME_LABEL);

          return await context.dispose();
        }

        console.log(whiteBright(`🏗️ Building Service Worker in ${MODE} mode...\n`));

        viteWatcher.add(ctx.options.serviceWorkerPath);
        await context.rebuild();
        hash = getWorkerHash(ctx.options);

        console.log('\n');
        console.timeEnd(TIME_LABEL);

        viteWatcher.on('add', async path => {
          if (path.includes('routes') || path.includes(ctx.options.entryWorkerFile)) {
            console.time(DEV_TIME_LABEL);

            // Rebuild only added routes as well as workers
            await context.rebuild();
            const oldHash = hash;
            hash = getWorkerHash(ctx.options);

            console.timeEnd(DEV_TIME_LABEL);
            // console.log('Service worker hash (MD5):', hash);
            // oldHash === hash
            //   ? console.log('Service worker hash is unchanged.')
            //   : console.log('Service worker hash has changed.');
            compareHash(ws, oldHash, hash);
          }
        });

        viteWatcher.on('change', async path => {
          if (path.includes('routes') || path.includes(ctx.options.entryWorkerFile)) {
            console.time(DEV_TIME_LABEL);

            // Rebuild only changed routes as well as workers
            await context.rebuild();
            const oldHash = hash;
            hash = getWorkerHash(ctx.options);

            console.timeEnd(DEV_TIME_LABEL);

            compareHash(ws, oldHash, hash);
          }
        });

        viteWatcher.on('unlink', async path => {
          if (path.includes('routes') || path.includes(ctx.options.entryWorkerFile)) {
            console.time(DEV_TIME_LABEL);

            // Rebuild only removed routes as well as workers
            await context.rebuild();
            const oldHash = hash;
            hash = getWorkerHash(ctx.options);

            console.timeEnd(DEV_TIME_LABEL);

            compareHash(ws, oldHash, hash);
          }
        });

        viteWatcher.on('error', async () => {
          console.error(red('🚨 Error occurred whilst watching files!'));

          await context.cancel();
          await context.dispose();
          await viteWatcher.close();

          process.exit(1);
        });
      });
    },
    closeBundle() {
      // 👀 what am I cooking here?
    },
  };
}
