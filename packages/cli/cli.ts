/* eslint-disable no-prototype-builtins */
/* eslint-disable prefer-rest-params */
import { Command, Option } from '@commander-js/extra-typings';
import { checkbox, confirm, input, select } from '@inquirer/prompts';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { dirname, resolve } from 'pathe';
import colors from 'picocolors';
import type { CompilerOptions } from 'typescript';
import ts from 'typescript';
import { fileURLToPath } from 'url';

const { blue, bold, cyan, green, italic, magenta, red } = colors;
const { ModuleKind, ScriptTarget, transpileModule } = ts;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

const importJson = async (path: string) => {
  try {
    return await import(path, { assert: { type: 'json' } });
  } catch (err) {
    if ((err as any).code === 'ERR_IMPORT_ATTRIBUTE_MISSING') {
      return await import(path, { with: { type: 'json' } });
    } else {
      console.error('💥 Error occured:', '\n\n', err);
      process.exit(1);
    }
  }
};

const installPackage = (packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun', packageName: string, dev = false) => {
  switch (packageManager) {
    case 'npm':
      execSync(`npm i -s ${packageName} ${dev ? '-D' : ''}`);
      break;
    case 'yarn':
      execSync(`yarn add ${packageName} ${dev ? '-D' : ''}`);
      break;
    case 'pnpm':
      execSync(`pnpm add ${packageName} ${dev ? '-D' : ''}`);
      break;
    case 'bun':
      execSync(`bun add --silent ${packageName} ${dev ? '-d' : ''}`);
      break;
    default:
      throw new Error(`💥 Unsupported package manager: ${packageManager}`);
  }
};

type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

const packageManagerExecScript: Record<PackageManager, string> = {
  npm: 'npx',
  yarn: 'yarn',
  pnpm: 'pnpm exec',
  bun: 'bunx',
};

function validatePackageManager(pkgManager: string): PackageManager {
  return packageManagerExecScript.hasOwnProperty(pkgManager) ? (pkgManager as PackageManager) : 'npm';
}

const packageJson = await importJson('./package.json');

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
  .command('init [dir]')
  .description('Scaffold a new React Router + Remix PWA application')
  .option('--no-install', 'Whether to install dependencies after scaffolding or not')
  .option('--no-git-init', 'Whether to initialize git or not')
  .option('-y, --yes', 'Skip all option prompts and run setup')
  .addOption(
    new Option('-r, --router <router>', 'Router to use (Remix/React Router)')
      .choices(['remix', 'react-router'])
      .default('react-router')
  )
  .addOption(
    new Option('-p, --package-manager <manager>', 'Package manager to use').choices(['npm', 'yarn', 'pnpm', 'bun'])
  )
  .addOption(
    new Option('-f, --features <feat...>', 'Remix PWA features to add')
      .choices(['sw', 'manifest', 'push', 'sync', 'client'])
      .default(['sw', 'manifest'])
  )
  // TODO: Create a template for this command
  .action(async (dir, options) => {
    // Cherry-picked from:
    // https://github.com/remix-run/react-router/blob/2313e238d29bf41986375934bd106a750f378931/packages/create-react-router/index.ts#L152
    const packageManager = validatePackageManager(
      options.packageManager ??
        // npm, pnpm, Yarn, and Bun set the user agent environment variable that can be used
        // to determine which package manager ran the command.
        (process.env.npm_config_user_agent ?? 'npm').split('/')[0]
    );
    const executable = packageManagerExecScript[packageManager];
    let router = options.router;
    let features = options.features as unknown as ('sw' | 'manifest' | 'push' | 'sync' | 'client')[];
    let install = options.install;
    let git = options.gitInit;

    const framework = router === 'remix' ? 'create remix@latest' : 'create react-router@latest';

    if (options.yes) {
      dir = dir ?? process.cwd();
      router = router ?? 'react-router';
      features = features ?? ['sw', 'manifest'];
      install = install ?? true;
      git = git ?? true;
    }

    if (!dir) {
      const inputDir = await input({
        message: '📂 Enter the directory to scaffold the application in',
        default: process.cwd(),
      });

      dir = inputDir;
    }

    if (!router) {
      const routerOptions = [
        {
          name: '💿 Remix',
          value: 'remix',
        },
        {
          name: '🔄 React Router',
          value: 'react-router',
        },
      ];

      const inputRouter = await select({
        message: '▶️ Select the router to use',
        choices: routerOptions,
      });

      router = inputRouter as 'remix' | 'react-router';
    }

    let swPath = 'app/entry.worker.ts';
    let manifestPath = 'app/routes/manifest[.webmanifest].ts';

    if (!features) {
      const inputFeatures = await checkbox({
        message: '▶️ Select the features to add',
        choices: [
          {
            name: '⚙️ Service Worker',
            value: 'sw',
          },
          {
            name: '🔖 Web Manifest',
            value: 'manifest',
          },
          {
            name: '🔔 Push Notifications',
            value: 'push',
          },
          {
            name: '🔃 Background Sync',
            value: 'sync',
          },
          {
            name: '📱 PWA Client Utilities',
            value: 'client',
          },
        ],
      });

      features = inputFeatures as ('sw' | 'manifest' | 'push' | 'sync' | 'client')[];

      if (features.includes('sw')) {
        const inputSwPath = await input({
          message: '📂 Enter the path for the service worker file',
          default: swPath,
        });
        swPath = inputSwPath;
      }

      if (features.includes('manifest')) {
        const inputManifestPath = await input({
          message: '📂 Enter the path for the web manifest file',
          default: manifestPath,
        });
        manifestPath = inputManifestPath;
      }
    }

    if (!git) {
      const inputGit = await confirm({
        message: '▶️ Initialize a git repository?',
      });

      git = inputGit;
    }

    if (!install) {
      const inputInstall = await confirm({
        message: '▶️ Install dependencies?',
      });

      install = inputInstall;
    }

    const frameworkCommand = `${executable} ${framework} ${dir} ${install ? '--install' : '--no-install'} ${git ? '--git-init' : '--no-git-init'}  --no-color --no-motion`;

    console.log(blue(`🔄 Scaffolding the ${router === 'remix' ? 'Remix' : 'React Router'} application...`));

    execSync(frameworkCommand);

    console.log(green('✅ Successfully scaffolded the application'));

    console.log(blue('\n🔄 Adding Remix PWA features...\n'));

    const installedPackages: string[] = [];

    if (features.includes('sw')) {
      console.log(blue('⚙️ Adding service worker...'));

      if (!installedPackages.includes('@remix-pwa/dev')) {
        installPackage(packageManager, '@remix-pwa/dev', true);
        installedPackages.push('@remix-pwa/dev');
      }

      if (!installedPackages.includes('@remix-pwa/worker-runtime')) {
        installPackage(packageManager, '@remix-pwa/worker-runtime', true);
        installedPackages.push('@remix-pwa/worker-runtime');
      }

      if (!installedPackages.includes('@remix-pwa/sw')) {
        installPackage(packageManager, '@remix-pwa/sw');
        installedPackages.push('@remix-pwa/sw');
      }

      const swDirPath = resolve(process.cwd(), dir, swPath.split('/').slice(0, -1).join('/'));
      if (existsSync(swDirPath)) {
        const templateContent = await readFile(resolve(__dirname, 'templates', 'entry.worker.ts'), 'utf-8');
        await writeFile(resolve(process.cwd(), dir, swPath), templateContent);
        console.log(green('✅ Service worker file created successfully'));
      } else {
        console.log(italic(`⚠️ Directory for service worker doesn't exist. Skipping file creation.`));
        console.log(italic(`📝 You can generate it later using 'remix-pwa sw -d ${swPath}'`));
      }
    }

    if (features.includes('manifest')) {
      console.log(blue('🔖 Adding web manifest...'));

      if (!installedPackages.includes('@remix-pwa/manifest')) {
        installPackage(packageManager, '@remix-pwa/manifest');
        installedPackages.push('@remix-pwa/manifest');
      }

      const manifestDirPath = resolve(process.cwd(), dir, manifestPath.split('/').slice(0, -1).join('/'));
      if (existsSync(manifestDirPath)) {
        const templateContent = await readFile(resolve(__dirname, 'templates', 'manifest[.webmanifest].ts'), 'utf-8');
        await writeFile(resolve(process.cwd(), dir, manifestPath), templateContent);
        console.log(green('✅ Web manifest file created successfully'));
      } else {
        console.log(italic(`⚠️ Directory for web manifest doesn't exist. Skipping file creation.`));
        console.log(italic(`📝 You can generate it later using 'remix-pwa manifest -d ${manifestPath}'`));
      }
    }

    if (features.includes('push')) {
      console.log(blue('🔔 Adding push notifications...'));

      if (!installedPackages.includes('@remix-pwa/dev')) {
        installPackage(packageManager, '@remix-pwa/dev', true);
        installedPackages.push('@remix-pwa/dev');
      }

      if (!installedPackages.includes('@remix-pwa/worker-runtime')) {
        installPackage(packageManager, '@remix-pwa/worker-runtime', true);
        installedPackages.push('@remix-pwa/worker-runtime');
      }

      if (!installedPackages.includes('@remix-pwa/push')) {
        installPackage(packageManager, '@remix-pwa/push');
        installedPackages.push('@remix-pwa/push');
      }
    }

    if (features.includes('sync')) {
      console.log(blue('🔃 Adding background sync...'));

      if (!installedPackages.includes('@remix-pwa/dev')) {
        installPackage(packageManager, '@remix-pwa/dev', true);
        installedPackages.push('@remix-pwa/dev');
      }

      if (!installedPackages.includes('@remix-pwa/worker-runtime')) {
        installPackage(packageManager, '@remix-pwa/worker-runtime', true);
        installedPackages.push('@remix-pwa/worker-runtime');
      }

      if (!installedPackages.includes('@remix-pwa/sync')) {
        installPackage(packageManager, '@remix-pwa/sync');
        installedPackages.push('@remix-pwa/sync');
      }
    }

    if (features.includes('client')) {
      console.log(blue('📱 Adding PWA client utilities...'));

      if (!installedPackages.includes('@remix-pwa/client')) {
        installPackage(packageManager, '@remix-pwa/client');
        installedPackages.push('@remix-pwa/client');
      }
    }

    console.log(green('✅ Successfully added all features'));
    console.log(blue('\n📦 Installed packages:'));
    installedPackages.forEach(pkg => console.log(blue(`- ${pkg}`)));

    console.log(cyan('\n💡 Tips:'));
    console.log(cyan('- Run `remix-pwa update` to update all packages to the latest version'));
    console.log(cyan('- Run `remix-pwa sw` to generate a service worker file'));
    console.log(cyan('- Run `remix-pwa manifest` to generate a web manifest file'));
    console.log(cyan('- Check out the docs at https://remix-pwa.com for further information :)'));
  });

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
      console.log('🔃 Generating JavaScript web manifest file...');

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
      console.log(green('✅ Successfully generated web manifest file'));
    } else {
      // Generate TypeScript web manifest file here...
      console.log('🔃 Generating TypeScript web manifest file...');

      const path = resolve(process.cwd(), dest);
      const dirPath = path.split('/').slice(0, -1).join('/');

      if (!existsSync(dirPath)) {
        console.error(`The directory "${dirPath}" does not exist`);
        process.exit(1);
      }

      const fileName = path.split('/').pop() ?? 'manifest[.webmanifest].ts';
      const templateContent = await readFile(resolve(__dirname, 'templates', 'manifest[.webmanifest].ts'), 'utf-8');

      await writeFile(resolve(process.cwd(), dirPath, fileName.replace(/\.js$/, '.ts')), templateContent);
      console.log(green('✅ Successfully generated web manifest file'));
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
      console.log('🔃 Generating JavaScript service worker file...');

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
      console.log(green('✅ Successfully generated service worker file'));
    } else {
      // Generate TypeScript service worker file here...
      console.log('🔃 Generating TypeScript service worker file...');

      const path = resolve(process.cwd(), dest);
      const dirPath = path.split('/').slice(0, -1).join('/');

      if (!existsSync(dirPath)) {
        console.error(`The directory "${dirPath}" does not exist`);
        process.exit(1);
      }

      const fileName = path.split('/').pop() ?? 'entry.worker.ts';
      const templateContent = await readFile(resolve(__dirname, 'templates', 'entry.worker.ts'), 'utf-8');

      await writeFile(resolve(process.cwd(), dirPath, fileName.replace(/\.js$/, '.ts')), templateContent);
      console.log(green('✅ Successfully generated service worker file'));
    }
  });

program
  .command('update')
  .alias('upgrade')
  .description('Update all `@remix-pwa/*` packages to latest')
  .option('-p, --packages <packages...>', 'Individual packages to update')
  .option('-r, --root <root>', "Location of app's root directory (where package.json is located)", '.')
  .option('-D, --dev', "Update packages to the latest 'dev' version")
  .action(async options => {
    const root = resolve(process.cwd(), options.root);
    const packagesToUpdate = options.packages ?? [];
    const TAG = options.dev ? 'dev' : 'latest';

    console.log(blue('🔃 Reading package.json file...'));

    const packageJSON: any = await importJson(
      'file://' + fileURLToPath(`file:///${resolve(root, 'package.json').replace(/\\/g, '/')}`)
    );

    const dependencies = packageJSON.default.dependencies;
    const devDependencies = packageJSON.default.devDependencies;

    if (!packagesToUpdate.length) {
      const allPackages = Object.keys(dependencies)
        .filter(dep => dep.startsWith('@remix-pwa'))
        .concat(['|'])
        .concat(Object.keys(devDependencies).filter(dep => dep.startsWith('@remix-pwa')));

      if (!allPackages.length) {
        console.error(red(bold('💥 No `@remix-pwa/*` packages found in dependencies')));
        process.exit(1);
      }

      console.log(blue('Found the following `@remix-pwa/*` packages:'));
      allPackages.forEach(pkg => pkg !== '|' && console.log(green(`- ${pkg}`)));
      console.log('\n', blue(`🚀 Updating all packages to ${italic(TAG)}...`));

      allPackages.forEach(pkg => {
        if (pkg === '|') return;

        const depType: 'dep' | 'devDep' = Object.keys(devDependencies).includes(pkg) ? 'devDep' : 'dep';

        if (depType === 'dep') {
          try {
            execSync(`npm i ${pkg}@${TAG}`);
          } catch (err) {
            console.error(`${red(`💥 Error occured whilst installing ${pkg}:`)}\n\n${err}`);
          }
        } else {
          try {
            execSync(`npm i -D ${pkg}@${TAG}`);
          } catch (err) {
            console.error(`${red(`💥 Error occured whilst installing ${pkg}:`)}\n\n${err}`);
          }
        }
      });

      console.log(green('✅ Successfully installed all packages:'));
      allPackages.forEach(pkg => pkg !== '|' && console.log(green(`- ${pkg}`)));

      process.exit(0);
    }

    console.log(blue('Confirmed and updating the following packages:'));
    packagesToUpdate.forEach(pkg => console.log(green(`- @remix-pwa/${pkg}`)));
    console.log('\n', blue(`🚀 Updating all confirmed packages to ${italic(TAG)}...`));

    packagesToUpdate.forEach(dep => {
      let depType: 'dep' | 'devDep' = 'dep';

      if (Object.keys(devDependencies).includes(`@remix-pwa/${dep}`)) depType = 'devDep';
      if (Object.keys(dependencies).includes(`@remix-pwa/${dep}`)) depType = 'dep';

      if (depType === 'dep') {
        try {
          execSync(`npm i ${dep}@${TAG}`);
        } catch (err) {
          console.error(`${red(`💥 Error occured whilst installing ${dep}:`)}\n\n${err}`);
        }
      } else {
        try {
          execSync(`npm i -D ${dep}@${TAG}`);
        } catch (err) {
          console.error(`${red(`💥 Error occured whilst installing ${dep}:`)}\n\n${err}`);
        }
      }
    });

    console.log(green('✅ Successfully installed all packages:'));
    packagesToUpdate.forEach(pkg => console.log(green(`- @remix-pwa/${pkg}`)));
  });

export default program;
