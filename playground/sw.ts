#!/usr/bin/env ts-node

import { run } from '@remix-pwa/dev';
import { readConfig as _readConfig } from '@remix-run/dev/dist/config.js';
import { ServerMode } from '@remix-run/dev/dist/config/serverModes.js';
import { watch } from 'chokidar';

/* ---------- */

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

/* ---------- */

async function main() {
  const projectDir = process.cwd();

  const remixConfig = await _readConfig(projectDir, ServerMode.Development);
  const appDir = remixConfig.appDirectory ?? resolveUrl(process.cwd(), 'app');

  const watcher = watch(appDir, {
    ignored(testString) {
      return testString.startsWith('.') || testString.match(/(\.(tsx|jsx|ts|js)$)/) === null;
    },
    followSymlinks: false,
    disableGlobbing: false,
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT signal received.');

    await watcher.close();

    process.exit(0);
  });

  /* Custom Watcher for dev script */
  if (process.argv[2] === 'dev') {
    watcher.on('ready', () => {
      console.log('Running in dev mode');
      console.log('Watching for changes in the app directory...');
    })

    new Promise(res => setTimeout(res, 10000)).then(() => {
      console.log('Watching for changes in the service worker file...');
    });

    // watcher.on('change', async (path) => {
    //   console.log(`File changed: ${path}`);
    // });

    // watcher.on('add', async (path) => {
    //   console.log(`File added: ${path}`);
    // });
  }

  // await run();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
