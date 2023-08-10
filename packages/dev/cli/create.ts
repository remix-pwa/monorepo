import { red } from 'colorette';
import { readFile } from 'fs';
import { pathExistsSync, readFileSync, writeFile } from 'fs-extra';
import { resolve } from 'path';
import { PWAFeatures } from './run.js';

let isV2 = false;

export type FlagOptionType = {
  dir: string;
  precache: boolean;
  install: boolean;
  workbox: boolean;
  lang: 'ts' | 'js';
  features: PWAFeatures[];
  packageManager: string;
};

async function integrateServiceWorker(
  projectDir: string,
  precache: boolean,
  _workbox: boolean,
  lang: 'ts' | 'js' = 'ts',
  dir: string = 'app'
) {
  const templateDir = resolve(__dirname, 'templates');

  console.log('Integrating Service Worker...'); // todo: ora spinners for each step

  if (precache) {
    // if (workbox) { return; }
    const workerDir = resolve(projectDir, dir, `entry.worker.${lang}`);

    if (pathExistsSync(workerDir)) {
      console.log(red('Service worker already exists'));
    } else {
      const workerContent = readFileSync(resolve(templateDir, 'app', `precache.worker.${lang}`), 'utf-8');

      await writeFile(workerDir, workerContent, 'utf-8');
    }
  } else {
    // if (workbox) { return; }

    const workerDir = resolve(projectDir, dir, `entry.worker.${lang}`);

    if (pathExistsSync(workerDir)) {
      console.log(red('Service worker already exists'));
    } else {
      const workerContent = readFileSync(resolve(templateDir, 'app', `entry.worker.${lang}`), 'utf-8');

      await writeFile(workerDir, workerContent, 'utf-8');
    }
  }
}

async function integrateManifest(projectDir: string, lang: 'ts' | 'js' = 'ts', dir: string = 'app') {
  const templateDir = resolve(__dirname, 'templates');
  const manifestDir = resolve(projectDir, dir, `routes/manifest[.]webmanifest.${lang}`);

  console.log('Integrating Web Manifest...'); // todo: ora spinners for each step

  if (pathExistsSync(manifestDir)) {
    return;
  }

  const manifestContent = readFileSync(resolve(templateDir, 'app', `manifest[.]webmanifest.js`), 'utf-8');
  await writeFile(manifestDir, manifestContent, 'utf-8');
}

export async function createPWA(
  projectDir: string = process.cwd(),
  options: FlagOptionType = {
    dir: 'app',
    precache: false,
    install: true,
    workbox: false,
    lang: 'ts',
    features: ['sw', 'manifest'],
    packageManager: 'npm',
  }
) {
  let { dir, precache, install, workbox, lang, features, packageManager } = options;

  if (workbox) {
    workbox = false;
  }

  readFile(resolve(projectDir, 'remix.config.js'), 'utf-8', (err, data) => {
    if (err) {
      console.log(
        red(
          'No `remix.config.js` file found in your project. Please make sure to run in a remix project or create one and try again or alternatively, run `remix-pwa --help` for more info.'
        )
      );
      return;
    }

    const remixConfig = eval(data);
    if (!remixConfig.future) {
      remixConfig.future = {};
    }

    if (remixConfig.future && remixConfig.future.v2_routeConvention == true) {
      isV2 = true;
    }
  });

  const templateDir = resolve(__dirname, 'templates');

  if (!pathExistsSync(templateDir)) {
    throw new Error('Template directory not found');
  }

  features.map(async feature => {
    switch (feature) {
      case 'sw':
        try {
          await integrateServiceWorker(projectDir, precache, workbox, lang, dir);
        } catch (err) {
          console.log(typeof err == 'string' ? red(err) : err);
        }
        break;
      case 'manifest':
        try {
          await integrateManifest(projectDir, lang, dir);
        } catch (err) {
          console.log(typeof err == 'string' ? red(err) : err);
        }
        break;
      case 'icons':
        console.log('workbox');
        break;
      case 'push':
        console.log('install');
        break;
      case 'utils':
        console.log('precache');
        break;
      default:
        break;
    }
  });

  if (install) {
    console.log('installing deps with', packageManager);
  } else {
    console.log(red(`Skipping ${packageManager} install...\n`));
    console.log(red(`Don't forget to run ${packageManager} install`));
  }
}
