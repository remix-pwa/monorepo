#!/usr/bin/env ts-node
//@ts-nocheck

const { readConfig: _readConfig } = require('@remix-run/dev/dist/config.js');
const { ServerMode } = require('@remix-run/dev/dist/config/serverModes.js');

/* ---------- */

const { platform } = require('os');
const { resolve } = require('path');
const { pathToFileURL } = require('url');

const isWindows = platform() === 'win32';

const resolveUrl = (...args: string[]) => {
  const url = resolve(...args);
  return !isWindows ? url : isAbsolute(url) ? pathToFileURL(url).href : url;
};

const isAbsolute = (path: string) => {
  return !isWindows ? resolve(path) === path : pathToFileURL(resolve(path)).href === path;
};

/* ---------- */

// async function main() {
(async () => {
  const run = (await import('@remix-pwa/dev')).run;
  // const watch = (await import('chokidar')).watch;

  // const projectDir = process.cwd();

  // const remixConfig = await _readConfig(projectDir, ServerMode.Development);
  // const appDir = remixConfig.appDirectory ?? resolveUrl(process.cwd(), 'app');

  // const watcher = watch(appDir, {
  //   ignored(testString: string) {
  //     return testString.startsWith('.');
  //   },
  //   followSymlinks: false,
  //   disableGlobbing: false,
  // });

  // process.on('SIGINT', async () => {
  //   console.log('SIGINT signal received.');

  //   await watcher.close();

  //   process.exit(0);
  // });

  // process.on('SIGTERM', async () => {
  //   console.log('SIGTERM signal received.');

  //   await watcher.close();

  //   process.exit(0);
  // });

  // process.on('SIGUSR2', async () => {
  //   console.log('SIGUSR2 signal received.');

  //   await watcher.close();

  //   process.exit(0);
  // });

  // /* Custom Watcher for dev script */
  // if (process.argv[2] === 'dev') {
  //   watcher.on('ready', () => {
  //     console.log('Running in dev mode');
  //     console.log('Watching for changes in the app directory...');
  //   });

  //   watcher.on('add', (path) => {
  //     console.log(`File ${path} has been added`);
  //   });

  //   watcher.on('change', (path) => {
  //     console.log(`File ${path} has been changed`);
  //   });

  //   watcher.on('unlink', path => {
  //     console.log(`File ${path} has been removed`);
  //   });

  //   watcher.on('error', () => {
  //     // use colorette for this!
  //     console.error('Watcher error occured!');
  //   });
  // }

  await run();
  // }
})();

