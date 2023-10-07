import { readConfig as _readConfig } from '@remix-run/dev/dist/config.js';
import { ServerMode } from '@remix-run/dev/dist/config/serverModes.js';
import { watch } from 'chokidar';
import { red } from 'colorette';
import type esbuild from 'esbuild';
import { platform } from 'os';
import { resolve } from 'path';
import { pathToFileURL } from 'url';

const isWindows = platform() === 'win32';

const resolveUrl = (...args: string[]) => {
  const url = resolve(...args);
  return !isWindows ? url : isAbsolute(url) ? pathToFileURL(url).href : url;
};

const isAbsolute = (path: string) => {
  return !isWindows ? resolve(path) === path : pathToFileURL(resolve(path)).href === path;
};

export const watcher = async (context: esbuild.BuildContext, projectDir: string) => {
  const remixConfig = await _readConfig(projectDir, ServerMode.Development);
  const appDir = remixConfig.appDirectory ?? resolveUrl(process.cwd(), 'app');

  const watcher = watch(appDir, {
    ignored(testString: string) {
      return testString.startsWith('.');
    },
    followSymlinks: false,
    disableGlobbing: false,
  });

  process.on('SIGINT', async () => {
    // console.log('SIGINT signal received.');
    console.log('👋 Bye!');

    await watcher.close();

    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    // console.log('SIGTERM signal received.');
    console.log('👋 Bye!');

    await watcher.close();

    process.exit(0);
  });

  process.on('SIGUSR2', async () => {
    // console.log('SIGUSR2 signal received.');
    console.log('👋 Bye!');

    await watcher.close();

    process.exit(0);
  });

  watcher.on('add', path => {
    // console.log(`File ${path} has been added`);

    if (path.includes('routes') || path.includes('.worker.')) {
      // Rebuild only added routes as well as workers
      context.rebuild();
    }
  });

  watcher.on('change', () => {
    // console.log(`File ${path} has been changed`);
    context.rebuild();
  });

  watcher.on('unlink', () => {
    // console.log(`File ${path} has been removed`);
    context.rebuild();
  });

  watcher.on('error', async () => {
    console.error(red('🚨 Error occurred whilst watching files!'));

    await context.cancel();
    await context.dispose();
    await watcher.close();

    process.exit(1);
  });
};
