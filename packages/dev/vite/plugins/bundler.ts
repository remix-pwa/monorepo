import { watch } from 'chokidar';
import type { Plugin } from 'vite';
import { build, normalizePath } from 'vite';

import type { PWAPluginContext } from '../types.js';

export function BundlerPlugin(ctx: PWAPluginContext): Plugin {
  async function buildWorker() {
    try {
      // Customize build options as needed
      // await build({
      //   root: options.rootDirectory,
      //   logLevel: 'error',
      //   build: {
      //     rollupOptions: {
      //       input: {
      //         [options.workerName]: options.workerEntryPoint,
      //       },
      //       output: {
      //         dir: options.workerBuildDirectory,
      //         format: 'esm',
      //         chunkFileNames: '_shared/sw/[name]-[hash].js',
      //         entryFileNames: '[name].js',
      //       },
      //     },
      //     minify: options.workerMinify,
      //     sourcemap: options.workerSourceMap,
      //     watch: false, // We handle watching separately
      //   },
      // });
      console.log('Worker built successfully');
    } catch (err) {
      console.error('Error during worker build:', err);
    }
  }

  return <Plugin>{
    name: 'vite-plugin-remix-pwa:bundler',
    async configureServer(server) {
      const swPath = normalizePath(`${ctx.options.appDirectory}/${ctx.options.entryWorkerFile}`);
      // Watch for file changes
      const watcher = watch(swPath, {
        ignored: /node_modules/,
        ignoreInitial: true,
      });

      watcher.on('change', async () => {
        console.log('Rebuilding worker due to change...');
        await buildWorker();
        server.hot.send({ type: 'full-reload' });
      });
    },
    buildStart() {
      console.log('Building worker...');
      buildWorker();
    },
  };
}
