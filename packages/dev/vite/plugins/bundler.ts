import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { resolve } from 'pathe';
import esbuild from 'rollup-plugin-esbuild';
import type { Plugin } from 'vite';
import { build, normalizePath } from 'vite';

import type { PWAPluginContext } from '../types.js';
import { VirtualSWPlugins } from './virtual-sw.js';

export function BundlerPlugin(ctx: PWAPluginContext): Plugin {
  async function buildWorker(_ctx: PWAPluginContext) {
    try {
      await build({
        logLevel: 'error',
        configFile: false,
        appType: undefined,
        plugins: [
          esbuild({
            platform: 'browser',
            color: true,
            treeShaking: true,
            format: 'esm',
            logLevel: 'error',
            sourcefile: _ctx.options.workerEntryPoint,
            charset: 'utf8',
            supported: {
              'import-meta': true,
            },
          }),
          nodeResolve({
            browser: true,
            mainFields: ['browser', 'module', 'main'],
          }),
          // @ts-ignore
          commonjs(),
          VirtualSWPlugins(_ctx),
        ],
        build: {
          outDir: _ctx.options.workerBuildDirectory,
          target: 'modules',
          // eslint-disable-next-line no-void
          lib: void 0,
          rollupOptions: {
            input: _ctx.options.workerEntryPoint,
            output: {
              entryFileNames: `${_ctx.options.workerName}.js`,
              format: 'esm',
              esModule: true,
              exports: 'none',
              strict: true,
              interop: 'auto',
              assetFileNames: '[name].[ext]',
              chunkFileNames: '_shared/sw/[name]-[hash]',
              name: _ctx.options.workerName,
              sourcemap: _ctx.options.workerSourceMap,
            },
            treeshake: true,
            watch: false,
            plugins: [
              esbuild({
                platform: 'browser',
                color: true,
                treeShaking: true,
                format: 'esm',
                logLevel: 'error',
                sourcefile: _ctx.options.workerEntryPoint,
                charset: 'utf8',
                supported: {
                  'import-meta': true,
                },
              }),
              nodeResolve({
                browser: true,
                mainFields: ['browser', 'module', 'main'],
              }),
              // @ts-ignore
              commonjs(),
              VirtualSWPlugins(_ctx),
            ],
          },
          minify: _ctx.options.workerMinify,
          sourcemap: _ctx.options.workerSourceMap,
          write: true,
          watch: null,
          emptyOutDir: false,
          manifest: false,
        },
      });
      // ESBuild
      // await build({
      //   entryPoints: {
      //     [_ctx.options.workerName]: _ctx.options.workerEntryPoint,
      //   },
      //   outdir: _ctx.options.workerBuildDirectory,
      //   bundle: true,
      //   platform: 'browser',
      //   absWorkingDir: resolve(_ctx.options.rootDirectory),
      //   format: 'esm',
      //   sourcemap: _ctx.options.workerSourceMap,
      //   minify: _ctx.options.workerMinify,
      //   logLevel: 'error',
      //   splitting: true,
      //   mainFields: ['browser', 'module', 'main'],
      //   treeShaking: true,
      //   supported: {
      //     'import-meta': true,
      //   },
      //   // plugins: [
      //   //   VirtualSWPlugins(_ctx),
      //   // ],
      // });
      console.log('Worker built successfully');
    } catch (err) {
      console.error('Error during worker build:', err);
    }
  }

  return <Plugin>{
    name: 'vite-plugin-remix-pwa:bundler',
    async configureServer(server) {
      server.watcher.add(ctx.options.serviceWorkerPath);

      if (!ctx.isRemixDevServer) return;

      server.watcher.on('change', async path => {
        if (normalizePath(path) === ctx.options.serviceWorkerPath) {
          server.config.logger.info('Rebuilding worker due to change...');
          // await buildWorker(ctx);
          // update to custom later
          // server.hot.send({ type: 'full-reload' });
        }
      });
    },
    buildStart() {
      if (!ctx.isRemixDevServer) return;

      console.log('Building worker...');
      buildWorker(ctx);
    },
    // async generateBundle(_options, bundle) {
    //   if (!ctx.isRemixDevServer) return;

    //   console.log('Worker built successfully', _options, bundle);
    // },
  };
}
