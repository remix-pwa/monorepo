import { blueBright, green, red } from 'colorette';
import { cpSync } from 'fs';
import pkg from 'fs-extra';
import { resolve } from 'path';
import { PWAFeatures } from './run.js';
import ora from 'ora';

let isV2 = false;

import { execSync } from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

    if (pkg.pathExistsSync(workerDir)) {
      console.log(red('Service worker already exists'));
    } else {
      const workerContent = pkg.readFileSync(resolve(templateDir, 'app', `precache.worker.${lang}`), 'utf-8');

      await pkg.writeFile(workerDir, workerContent, 'utf-8');
    }
  } else {
    // if (workbox) { return; }

    const workerDir = resolve(projectDir, dir, `entry.worker.${lang}`);

    if (pkg.pathExistsSync(workerDir)) {
      console.log(red('Service worker already exists'));
    } else {
      const workerContent = pkg.readFileSync(resolve(templateDir, 'app', `entry.worker.${lang}`), 'utf-8');

      await pkg.writeFile(workerDir, workerContent, 'utf-8');
    }
  }
}

async function integrateManifest(projectDir: string, lang: 'ts' | 'js' = 'ts', dir: string = 'app') {
  const templateDir = resolve(__dirname, 'templates');
  const manifestDir = resolve(projectDir, dir, `routes/manifest[.]webmanifest.${lang}`);

  console.log('Integrating Web Manifest...'); // todo: ora spinners for each step

  if (pkg.pathExistsSync(manifestDir)) {
    return;
  }

  const manifestContent = pkg.readFileSync(resolve(templateDir, 'app', `manifest[.]webmanifest.js`), 'utf-8');
  await pkg.writeFile(manifestDir, manifestContent, 'utf-8');
}

async function integrateIcons(projectDir: string) {
  const iconDir = resolve(__dirname, 'templates', 'icons');

  cpSync(iconDir, resolve(projectDir, 'public/icons'), { recursive: true, errorOnExist: false });
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
  },
  _isTest: boolean = false
) {
  let { dir, precache, install, workbox, lang, features, packageManager } = options;

  if (workbox) {
    workbox = false;
  }

  try {
    let remixConfig = await import(resolve(projectDir, 'remix.config.js')).then(m => m.default);

    if (!remixConfig.future) {
      remixConfig.future = {};
    }

    if (remixConfig.future && remixConfig.future.v2_routeConvention == true) {
      isV2 = true;
    }
  } catch (_err) {
    console.log(
      red(
        'No `remix.config.js` file found in your project. Please make sure to run in a remix project or create one and try again or alternatively, run `remix-pwa --help` for more info.'
      )
    );

    return;
  }

  const templateDir = resolve(__dirname, 'templates');

  if (!pkg.pathExistsSync(templateDir)) {
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
        integrateIcons(projectDir);
        break;
      case 'push':
        console.log('install');
        break;
      case 'utils':
      default:
        break;
    }
  });

  const pkgJsonPath = resolve(projectDir, 'package.json');
  const json = JSON.parse(pkg.readFileSync(pkgJsonPath, 'utf-8'));

  // This three clauses should never run, else you are doing
  // utter nonsense with your remix project.
  if (!json.hasOwnProperty('dependencies')) {
    json.dependencies = {};
  }

  if (!json.hasOwnProperty('devDependencies')) {
    json.devDependencies = {};
  }

  if (!json.hasOwnProperty('scripts')) {
    json.scripts = {};
  }

  json.dependencies['dotenv'] = '^16.0.3';

  // Todo: Add `remix-pwa` dependencies here

  json.devDependencies['npm-run-all'] = '^4.1.5';

  json.scripts['build'] = 'run-s build:*';
  json.scripts['build:remix'] = 'remix build';
  json.scripts['build:worker'] = 'remix-pwa build';

  json.scripts['dev'] = 'run-p dev:*';
  json.scripts['dev:remix'] = 'remix dev';
  json.scripts['dev:worker'] = 'remix-pwa dev';

  pkg.writeFileSync(pkgJsonPath, JSON.stringify(json, null, 2));

  if (install) {
    let spinner = ora({
      text: blueBright(`Running ${packageManager} install...`),
      spinner: 'dots',
    }).start();

    if (!_isTest) {
      execSync(`${packageManager} install ${packageManager == 'yarn' ? null : '--loglevel silent'}`, {
        cwd: process.cwd(),
        stdio: 'inherit',
      });

      spinner.succeed(`Successfully ran ${packageManager} install!`);
      spinner.clear();
    } else {
      spinner.succeed(`Successfully installed dependencies!`).clear();
    }
  } else {
    console.log(red(`Skipping ${packageManager} install...\n`));
    console.log(red(`Don't forget to run ${packageManager} install`));
  }

  // literally achieves nothing but uncool suspense for the user
  await new Promise(res => setTimeout(res, 853));

  console.log(green('\n✔ Successfully ran postinstall scripts!'));
}
