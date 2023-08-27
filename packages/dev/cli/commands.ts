import { yellow } from 'colorette';

import { runCompiler } from '../compiler/compiler.js';
import type { FlagOptionType } from './create.js';
import { createPWA } from './create.js';

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
