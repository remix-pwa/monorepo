import { execSync } from 'child_process';
import { blue, yellow } from 'colorette';

import { runCompiler } from '../compiler/compiler.js';
import type { FlagOptionType } from './create.js';
import { createPWA } from './create.js';
import { detectPackageManager } from './detectPkgManager.js';

export const dev = async (projectDir: string = process.cwd()) => {
  await runCompiler('dev', projectDir);
};

export const build = async (projectDir: string = process.cwd()) => {
  await runCompiler('build', projectDir);
};

export const push = async () => {
  console.warn(yellow('Scaffolding the Push API is still a Work-In-Progress.'));
};

export const init = async (dir: string, answer: FlagOptionType) => {
  await createPWA(dir, answer);
};

export const eject = async () => {
  // I guess a way to remove service workers ain't too much to ask, eh?
  // probs. a v4 thing
  console.warn(yellow('Ejecting is still a Work-In-Progress.'));
};

export const packages = async (dir: string) => {
  const pkgManager = await detectPackageManager(dir);

  // TODO: Add `ora` as an extra flair
  console.log(blue('Installing base packages for remix-pwa...\n\n'));
  console.log(
    yellow('installing:\n- @remix-pwa/sw\n- @remix-pwa/dev\n- @remix-pwa/worker-runtime\n- @remix-pwa/cache\n')
  );

  execSync(
    `${pkgManager ?? 'npm'} ${pkgManager === 'yarn' ? 'add' : 'install'} @remix-pwa/sw@latest @remix-pwa/cache@latest`
  );

  execSync(
    `${pkgManager ?? 'npm'} ${
      pkgManager === 'yarn' ? 'add' : 'install'
    } -D @remix-pwa/dev@latest @remix-pwa/worker-runtime@latest`
  );
};
