import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import { build, normalizePath } from 'vite';

import type { PWAPluginContext } from '../types.js';
import { VirtualSWPlugins } from './virtual-sw.js';

export function BundlerPlugin(ctx: PWAPluginContext): Plugin {
  async function buildWorker() {
    try {
      await build({
        logLevel: 'error',
        configFile: false,
        appType: undefined,
        plugins: [VirtualSWPlugins()],
        build: {
          outDir: normalizePath(resolve(process.cwd(), 'public')),
          rollupOptions: {
            input: {
              worker: '@remix-pwa/worker-runtime',
            },
            output: {
              entryFileNames: 'worker.js',
              format: 'esm',
              assetFileNames: '[name].[ext]',
              chunkFileNames: '_shared/sw/[name]-[hash]',
              name: 'worker',
            },
            treeshake: true,
            watch: false,
            plugins: [VirtualSWPlugins()],
          },
          minify: false,
          sourcemap: false,
          write: true,
          watch: null,
          emptyOutDir: false,
          manifest: false,
        },
      });
      console.log('Worker built successfully');
    } catch (err) {
      console.error('Error during worker build:', err);
    }
  }

  return <Plugin>{
    name: 'vite-plugin-remix-pwa:bundler',
    async configureServer(server) {
      if (server.config.appType !== undefined) {
        return;
      }

      const swPath = normalizePath(`${ctx.options.appDirectory}/${ctx.options.entryWorkerFile}`);

      server.watcher.add(swPath);

      server.watcher.on('change', async path => {
        if (server.config.command === 'serve') {
          console.log('Running during dev mode');
        }

        if (normalizePath(path) === swPath) {
          server.config.logger.info('Rebuilding worker due to change...');
          await buildWorker();
          server.hot.send({ type: 'full-reload' });
        }
      });
    },
    buildStart() {
      console.log('Building worker...');
      buildWorker();
    },
  };
}
