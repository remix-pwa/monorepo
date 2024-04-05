/* eslint-disable prefer-rest-params */

import { Command } from '@commander-js/extra-typings';
import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { dirname, resolve } from 'pathe';
import colors from 'picocolors';
import type { CompilerOptions } from 'typescript';
import ts from 'typescript';
import { fileURLToPath } from 'url';

// Disable experimental warnings (due to `import` statement assertions)
//
// Cherry-picked from:
// https://github.com/yarnpkg/berry/blob/2cf0a8fe3e4d4bd7d4d344245d24a85a45d4c5c9/packages/yarnpkg-pnp/sources/loader/applyPatch.ts#L414-L435
const originalEmit = process.emit;
// @ts-expect-error - TS complains about the return type of originalEmit.apply
// eslint-disable-next-line @typescript-eslint/no-unused-vars
process.emit = function (name, data, ..._args) {
  if (
    name === `warning` &&
    typeof data === `object` &&
    // @ts-ignore
    data.name === `ExperimentalWarning`
  )
    return false;

  return originalEmit.apply(process, arguments as unknown as Parameters<typeof process.emit>);
};

const packageJson = await import('./package.json', { assert: { type: 'json' } });

const { magenta } = colors;
const { ModuleKind, ScriptTarget, transpileModule } = ts;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compilerOptions: CompilerOptions = {
  module: ModuleKind.ES2022,
  target: ScriptTarget.ES2022,
  allowJs: true,
  lib: ['ES2022', 'WebWorker'],
};

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
  .option(
    '-d, --dest <outFile>',
    'Destination directory for the service worker file',
    'app/routes/manifest[.webmanifest].ts'
  )
  .action(async options => {
    let { dest, js, ts } = options;

    if (js && ts) {
      console.error('You can only generate one type of web manifest file');
      process.exit(1);
    }

    if (!js && !ts) {
      ts = true;
    }

    if (js) {
      // Generate JavaScript web manifest file here...
      console.log('Generating JavaScript web manifest file...');

      const path = resolve(process.cwd(), dest);
      const dirPath = path.split('/').slice(0, -1).join('/');

      if (!existsSync(dirPath)) {
        console.error(`The directory "${dirPath}" does not exist`);
        process.exit(1);
      }

      const fileName = path.split('/').pop() ?? 'manifest[.webmanifest].js';

      const templateContent = await readFile(resolve(__dirname, 'templates', 'manifest[.webmanifest].ts'), 'utf-8');
      const { diagnostics, outputText } = transpileModule(templateContent, {
        compilerOptions,
      });

      if (diagnostics && diagnostics.length) {
        console.error(diagnostics);
        process.exit(1);
      }

      await writeFile(resolve(process.cwd(), dirPath, fileName.replace(/\.ts$/, '.js')), outputText);
    } else {
      // Generate TypeScript web manifest file here...
      console.log('Generating TypeScript web manifest file...');

      const path = resolve(process.cwd(), dest);
      const dirPath = path.split('/').slice(0, -1).join('/');

      if (!existsSync(dirPath)) {
        console.error(`The directory "${dirPath}" does not exist`);
        process.exit(1);
      }

      const fileName = path.split('/').pop() ?? 'manifest[.webmanifest].ts';
      const templateContent = await readFile(resolve(__dirname, 'templates', 'manifest[.webmanifest].ts'), 'utf-8');

      await writeFile(resolve(process.cwd(), dirPath, fileName.replace(/\.js$/, '.ts')), templateContent);
    }
  });

program
  .command('sw')
  .alias('service-worker')
  .description('Generate a service worker file')
  .option('--js', 'Generate JavaScript service worker file')
  .option('-d, --dest <outFile>', 'Destination directory for the service worker file', 'app/entry.worker.ts')
  // .option('-t, --type <sw-type>', 'Type of service worker to generate', 'workbox') // todo: later
  .action(async options => {
    const { dest, js } = options;

    if (js) {
      // Generate JavaScript service worker file here...
      console.log('Generating JavaScript service worker file...');

      const path = resolve(process.cwd(), dest);
      const dirPath = path.split('/').slice(0, -1).join('/');

      if (!existsSync(dirPath)) {
        console.error(`The directory "${dirPath}" does not exist`);
        process.exit(1);
      }

      const fileName = path.split('/').pop() ?? 'entry.worker.js';

      const templateContent = await readFile(resolve(__dirname, 'templates', 'entry.worker.ts'), 'utf-8');
      const { diagnostics, outputText } = transpileModule(templateContent, {
        compilerOptions,
      });

      if (diagnostics && diagnostics.length) {
        console.error(diagnostics);
        process.exit(1);
      }

      await writeFile(resolve(process.cwd(), dirPath, fileName.replace(/\.ts$/, '.js')), outputText);
    } else {
      // Generate TypeScript service worker file here...
      console.log('Generating TypeScript service worker file...');

      const path = resolve(process.cwd(), dest);
      const dirPath = path.split('/').slice(0, -1).join('/');

      if (!existsSync(dirPath)) {
        console.error(`The directory "${dirPath}" does not exist`);
        process.exit(1);
      }

      const fileName = path.split('/').pop() ?? 'entry.worker.ts';
      const templateContent = await readFile(resolve(__dirname, 'templates', 'entry.worker.ts'), 'utf-8');

      await writeFile(resolve(process.cwd(), dirPath, fileName.replace(/\.js$/, '.ts')), templateContent);
    }
  });

export default program;
