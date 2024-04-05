import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { watch } from 'chokidar';
import esbuild from 'rollup-plugin-esbuild';
import type { Plugin } from 'vite';
import { build, normalizePath } from 'vite';

import { compareHash, getWorkerHash } from '../hash.js';
import type { PWAPluginContext } from '../types.js';
import { VirtualSWPlugins } from './virtual-sw.js';

export async function buildWorker(_ctx: PWAPluginContext) {
  try {
    await build({
      logLevel: 'error',
      configFile: false,
      appType: undefined,
      define: {
        'process.env.NODE_ENV': JSON.stringify(_ctx.isDev ? 'development' : 'production'),
      },
      plugins: [
        esbuild({
          platform: 'browser',
          color: true,
          treeShaking: true,
          format: 'esm',
          logLevel: 'error',
          sourcefile: _ctx.options.workerEntryPoint,
          charset: 'utf8',
          define: {
            'process.env.NODE_ENV': JSON.stringify(_ctx.isDev ? 'development' : 'production'),
          },
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
  } catch (err) {
    console.error('Error during worker build:', err);
  }
}

export function BundlerPlugin(ctx: PWAPluginContext): Plugin {
  let hash: string;

  return <Plugin>{
    name: 'vite-plugin-remix-pwa:bundler',
    async configureServer(server) {
      if (!ctx.isRemixDevServer) return;

      const watcher = watch(ctx.options.appDirectory, {
        ignoreInitial: true,
        ignored(testString: string) {
          return testString.startsWith('.');
        },
        followSymlinks: false,
        disableGlobbing: false,
      });

      const shouldAppReload = (path: string) => {
        path = normalizePath(path);

        return path === ctx.options.serviceWorkerPath || path.includes('/routes/') || path.endsWith('root.tsx');
      };

      watcher.on('change', async path => {
        if (shouldAppReload(path)) {
          const oldHash = hash;

          await buildWorker(ctx);
          hash = getWorkerHash(ctx.options);

          compareHash(server.hot, oldHash, hash);
        }
      });
    },
    async buildStart() {
      if (!ctx.isRemixDevServer) return;

      if (ctx.isDev || ctx.__remixPluginContext.isSsrBuild) {
        const TIME_LABEL = '💿 Built Service Worker in';
        console.time(TIME_LABEL);

        console.log(`🏗️  Building Service Worker in ${ctx.isDev ? 'development' : 'production'} mode...`);
        await buildWorker(ctx);
        hash = getWorkerHash(ctx.options);

        console.timeEnd(TIME_LABEL);
      }
    },
  };
}
