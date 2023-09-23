/* eslint-disable no-prototype-builtins */
import { execSync } from 'child_process';
import { blueBright, green, red, white } from 'colorette';
import { cpSync } from 'fs';
import pkg from 'fs-extra';
import ora from 'ora';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { getPkgVersion } from './getPkgVersion.js';
import type { PWAFeatures } from './run.js';

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

  if (precache) {
    // if (workbox) { return; }
    const workerDir = resolve(projectDir, dir, `entry.worker.${lang}`);

    if (pkg.pathExistsSync(workerDir)) {
      console.log(red('Service worker already exists'));
    } else {
      const workerContent = await pkg.readFile(resolve(templateDir, 'app', `precache.worker.${lang}`), 'utf-8');

      await pkg.writeFile(workerDir, workerContent, 'utf-8');
    }
  } else {
    // if (workbox) { return; }

    const workerDir = resolve(projectDir, dir, `entry.worker.${lang}`);

    if (pkg.pathExistsSync(workerDir)) {
      console.log(red('Service worker already exists'));
    } else {
      const workerContent = await pkg.readFile(resolve(templateDir, 'app', `entry.worker.${lang}`), 'utf-8');

      await pkg.writeFile(workerDir, workerContent, 'utf-8');
    }
  }
}

async function integrateManifest(projectDir: string, lang: 'ts' | 'js' = 'ts', dir: string = 'app') {
  const templateDir = resolve(__dirname, 'templates');
  const manifestDir = resolve(projectDir, dir, `routes/manifest[.]webmanifest.${lang}`);

  if (pkg.pathExistsSync(manifestDir)) {
    return;
  }

  const manifestContent = pkg.readFileSync(resolve(templateDir, 'app', `manifest[.]webmanifest.js`), 'utf-8');
  await pkg.writeFile(manifestDir, manifestContent, 'utf-8');
}

async function integrateIcons(projectDir: string) {
  const iconDir = resolve(__dirname, 'templates', 'icons');

  cpSync(iconDir, resolve(projectDir, 'public/icons'), {
    recursive: true,
    errorOnExist: false,
    force: false,
  });
}

// temporary
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function integratePush(projectDir: string, lang: 'ts' | 'js' = 'ts', dir: string = 'app') {
  console.log('Push API is still coming to v3.0 later...');
  return null;
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
  let { dir, features, install, lang, packageManager, precache, workbox } = options;

  if (workbox) {
    workbox = false;
  }

  // v2 is out already!!! And I am not using `isV2`, so no worries.
  // try {
  //   const remixConfig = await import(resolve(projectDir, 'remix.config.js')).pathname).then(m => m.defau;

  //   if (!remixConfig.future) {
  //     remixConfig.future = {};
  //   }

  //   if (remixConfig.future && remixConfig.future.v2_routeConvention === true) {
  //     isV2 = true;
  //   }
  // } catch (_err) {
  //   console.log(
  //     red(
  //       'No `remix.config.js` file found in your project. Please make sure to run in a remix project or create one and try again or alternatively, run `remix-pwa --help` for more info.'
  //     )
  //   );

  //   return;
  // }

  const templateDir = resolve(__dirname, 'templates');

  if (!pkg.pathExistsSync(templateDir)) {
    throw new Error('Template directory not found');
  }

  let push = false;
  let utils = false;
  let sync = false;

  features.map(async feature => {
    switch (feature) {
      case 'sw':
        try {
          const spinnerWorker = ora({
            text: white(`Integrating Service Worker...\n`),
            spinner: 'dots',
          }).start();

          await integrateServiceWorker(projectDir, precache, workbox, lang, dir);

          spinnerWorker.succeed(`Successfully integrated Service Worker!`);
          spinnerWorker.clear();
        } catch (err) {
          console.log(typeof err === 'string' ? red(err) : err);
        }
        break;
      case 'manifest':
        try {
          const spinnerManifest = ora({
            text: white(`Integrating Web Manifest...\n`),
            spinner: 'dots',
          }).start();

          await integrateManifest(projectDir, lang, dir);

          spinnerManifest.succeed(`Successfully integrated Web Manifest!`);
          spinnerManifest.clear();
        } catch (err) {
          console.log(typeof err === 'string' ? red(err) : err);
        }
        break;
      case 'icons':
        await integrateIcons(projectDir);
        break;
      case 'push':
        push = true;
        await integratePush(projectDir, lang, dir);
        break;
      case 'utils':
        utils = true;
        break;
      case 'sync':
        sync = true;
        break;
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

  json.dependencies.dotenv = '^16.3.1';

  json.devDependencies['@remix-pwa/worker-runtime'] = `^${
    _isTest ? '' : await getPkgVersion('@remix-pwa/worker-runtime')
  }`;
  json.devDependencies['@remix-pwa/dev'] = `${_isTest ? '' : await getPkgVersion('@remix-pwa/dev')}`;
  json.devDependencies['remix-pwa'] = `^${_isTest ? '' : await getPkgVersion('remix-pwa')}`;
  json.devDependencies['npm-run-all'] = '^4.1.5';
  json.devDependencies.glob = `^${_isTest ? '' : await getPkgVersion('glob')}`;

  if (features.includes('sw')) {
    json.dependencies['@remix-pwa/cache'] = `^${_isTest ? '' : await getPkgVersion('@remix-pwa/cache')}`;
    json.dependencies['@remix-pwa/sw'] = `^${_isTest ? '' : await getPkgVersion('@remix-pwa/sw')}`;
    json.dependencies['@remix-pwa/strategy'] = `^${_isTest ? '' : await getPkgVersion('@remix-pwa/strategy')}`;
  }

  if (push) {
    json.dependencies['@remix-pwa/push'] = `^${_isTest ? '' : await getPkgVersion('@remix-pwa/push')}`;
  }

  if (utils) {
    json.dependencies['@remix-pwa/client'] = `^${_isTest ? '' : await getPkgVersion('@remix-pwa/client')}`;
  }

  if (sync) {
    json.dependencies['@remix-pwa/sync'] = `^${_isTest ? '' : await getPkgVersion('@remix-pwa/sync')}`;
  }

  json.scripts.build = 'run-s build:*';
  json.scripts['build:remix'] = 'remix build';
  json.scripts['build:worker'] = 'remix-pwa build';

  json.scripts.dev = 'run-p dev:*';
  json.scripts['dev:remix'] = 'remix dev';
  json.scripts['dev:worker'] = 'remix-pwa dev';

  pkg.writeFileSync(pkgJsonPath, JSON.stringify(json, null, 2));

  // slow down a bit before moving on
  await new Promise(resolve => setTimeout(resolve, 1_000));

  if (install) {
    const spinner = ora({
      text: blueBright(`Running ${packageManager} install...\n`),
      spinner: 'dots',
    }).start();

    if (!_isTest) {
      execSync(`${packageManager} install ${packageManager === 'yarn' ? null : '--loglevel silent'}`, {
        cwd: process.cwd(),
        stdio: 'inherit',
      });

      spinner.succeed(`Successfully ran ${packageManager} install!\n`);
      spinner.clear();
    } else {
      spinner.succeed(`Successfully installed dependencies!`).clear();
    }
  } else {
    console.log(red(`Skipping ${packageManager} install...\n`));
    console.log(red(`Don't forget to run ${packageManager} install`));
  }

  // literally achieves nothing but uncool suspense for the user
  await new Promise(resolve => setTimeout(resolve, 853));

  console.log(green('\n✔ Successfully ran postinstall scripts!'));
}
