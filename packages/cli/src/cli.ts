#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings';
import colors from 'picocolors';

const packageJson = await import('../package.json', { assert: { type: 'json' } });

const { magenta } = colors;

const program = new Command();

program
  .name('remix-pwa')
  .addHelpText(
    'beforeAll',
    magenta(`______               _       ______ _    _  ___  
| ___ \\             (_)      | ___ \\ |  | |/ _ \\ 
| |_/ /___ _ __ ___  ___  __ | |_/ / |  | / /_\\ \\
|    // _ \\ '_ \` _ \\| \\ \\/ / |  __/| |/\\| |  _  |
| |\\ \\  __/ | | | | | |>  <  | |   \\  /\\  / | | |
\\_| \\_\\___|_| |_| |_|_/_/\\_\\ \\_|    \\/  \\/\\_| |_/
`)
  )
  .description('An elegant CLI for everything Remix PWA 💖')
  .summary('🔨 Remix PWA CLI Tool')
  .usage('<command> [options]')
  .version(packageJson.default.version);

program
  .command('manifest')
  .description('Generate a web manifest file')
  .option('--js', 'Generate JavaScript web manifest file')
  .option('--ts', 'Generate TypeScript web manifest file (default)')
  .action(options => {
    let { js, ts } = options;

    if (js && ts) {
      console.error('You can only generate one type of web manifest file');
      process.exit(1);
    }

    if (!js && !ts) {
      ts = true;
    }

    // Generate web manifest file here...

    console.log('Generating web manifest file...', { js, ts });
  });

program
  .command('sw')
  .alias('service-worker')
  .description('Generate a service worker file')
  .option('--js', 'Generate JavaScript service worker file')
  .option('-d, --dest <outFile>', 'Destination directory for the service worker file', 'app/routes/entry.worker.ts')
  // .option('-t, --type <sw-type>', 'Type of service worker to generate', 'workbox') // todo: later
  .action(options => {
    const { dest, js } = options;

    if (js) {
      // Generate JavaScript service worker file here...
      console.log('Generating JavaScript service worker file...', { dest });
    } else {
      // Generate TypeScript service worker file here...
      console.log('Generating TypeScript service worker file...', { dest });
    }
  });

program
  .command('icons')
  .description('Generate favicons and app icons')
  .action(() => {
    // Generate favicons and app icons here...
    console.log('Generating favicons and app icons...');
  });

program.parse(process.argv);
