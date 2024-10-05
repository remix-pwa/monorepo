import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { watch } from 'chokidar';
import esbuild from 'rollup-plugin-esbuild';
import type { Plugin } from 'vite';
import { build, normalizePath } from 'vite';

import { compareHash, getWorkerHash } from '../hash.js';
import type { PWAPluginContext } from '../types.js';
import { VirtualSWPlugins } from './virtual-sw.js';

const transformedObject = (obj: Record<string, string>) =>
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, JSON.stringify(value)]));

export async function buildWorker(_ctx: PWAPluginContext) {
  const DEFAULT_VARS: Record<string, string | any> = {
    'process.env.NODE_ENV': _ctx.isDev ? 'development' : 'production',
    'process.env.__REMIX_PWA_SPA_MODE': _ctx.__remixPluginContext.remixConfig.ssr ? 'false' : 'true',
    'process.env.__REMIX_SINGLE_FETCH': _ctx.__remixPluginContext.remixConfig.future.unstable_singleFetch
      ? 'true'
      : 'false',
  };

  DEFAULT_VARS['process.env'] = JSON.stringify(
    Object.fromEntries(
      Object.entries(DEFAULT_VARS)
        .filter(([key]) => key.startsWith('process.env.'))
        .map(([key, value]) => [key.replace('process.env.', ''), value])
    )
  );

  try {
    await build({
      logLevel: 'error',
      configFile: false,
      appType: undefined,
      define: {
        ...transformedObject(DEFAULT_VARS),
        ...transformedObject(_ctx.options.buildVariables),
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
            ...DEFAULT_VARS,
            ...transformedObject(_ctx.options.buildVariables),
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
        // disableGlobbing: false, // if an error arises 👈
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
