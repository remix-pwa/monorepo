import type { Context } from '@remix-run/dev/dist/compiler/context.js';
import { emptyModulesPlugin } from '@remix-run/dev/dist/compiler/plugins/emptyModules.js';
import type { BuildOptions, Plugin as EsbuildPlugin } from 'esbuild';
import { context } from 'esbuild';
import type { FSWatcher, Plugin } from 'vite';
import entryModulePlugin from 'vite/esbuild/entry-plugin.js';
import type { PWAPluginContext } from 'vite/types.js';

export function CompilerPlugin(ctx: PWAPluginContext): Plugin {
  let watcher: FSWatcher | null = null;
  let viteCommand: 'serve' | 'build';

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

  return <Plugin>{
    name: 'vite-plugin-remix-pwa:compiler',
    config(_config, configEnv) {
      viteCommand = configEnv.command;
    },
    // development only
    configureServer({ watcher: viteWatcher, ws }) {
      watcher = viteWatcher;

      const esbuildPluginContext = { config: ctx.options } as unknown as Context;

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
          // entryModulePlugin(ctx.options),
        ],
      }).then(async context => {
        // implement later
      });

      viteWatcher.on('add', path => {});
    },
    closeBundle() {
      console.log('Done');
      if (watcher) {
        watcher.close();
      }
    },
  };
}
