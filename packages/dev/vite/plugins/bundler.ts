import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import type { Plugin } from 'vite';
import { build, normalizePath } from 'vite';

import type { PWAPluginContext } from '../types.js';
import { VirtualSWPlugins } from './virtual-sw.js';

export function BundlerPlugin(ctx: PWAPluginContext): Plugin {
  // async function buildWorker(_ctx: PWAPluginContext) {
  //   try {
  //     await build({
  //       logLevel: 'error',
  //       configFile: false,
  //       appType: undefined,
  //       plugins: [
  //         nodeResolve({
  //           browser: true,
  //           mainFields: ['browser', 'module', 'main'],
  //         }),
  //         // @ts-ignore
  //         commonjs(),
  //         VirtualSWPlugins(_ctx),
  //       ],
  //       build: {
  //         outDir: _ctx.options.workerBuildDirectory,
  //         rollupOptions: {
  //           input: _ctx.options.workerEntryPoint,
  //           output: {
  //             // file: `${_ctx.options.workerName}.js`,
  //             entryFileNames: `${_ctx.options.workerName}.js`,
  //             format: 'es',
  //             // assetFileNames: '[name].[ext]',
  //             // chunkFileNames: '_shared/sw/[name]-[hash]',
  //             // name: _ctx.options.workerName,
  //           },
  //           treeshake: true,
  //           watch: false,
  //           plugins: [
  //             nodeResolve({
  //               browser: true,
  //               mainFields: ['browser', 'module', 'main'],
  //             }),
  //             // @ts-ignore
  //             commonjs(),
  //             VirtualSWPlugins(_ctx),
  //           ],
  //         },
  //         minify: _ctx.options.workerMinify,
  //         sourcemap: _ctx.options.workerSourceMap,
  //         write: true,
  //         watch: null,
  //         emptyOutDir: false,
  //         manifest: false,
  //       },
  //     });
  //     console.log('Worker built successfully');
  //   } catch (err) {
  //     console.error('Error during worker build:', err);
  //   }
  // }

  return <Plugin>{
    name: 'vite-plugin-remix-pwa:bundler',
    async configureServer(server) {
      server.watcher.add(ctx.options.serviceWorkerPath);

      if (!ctx.isRemixDevServer) return;

      server.watcher.on('change', async path => {
        if (normalizePath(path) === ctx.options.serviceWorkerPath) {
          server.config.logger.info('Rebuilding worker due to change...');
          await buildWorker(ctx);
          // update to custom later
          server.hot.send({ type: 'full-reload' });
        }
      });
    },
    buildStart() {
      if (!ctx.isRemixDevServer) return;

      console.log('Building worker...');
      // buildWorker(ctx);
    },
    async generateBundle(_options, bundle) {
      if (!ctx.isRemixDevServer) return;

      console.log('Worker built successfully', _options, bundle);
    },
  };
}
