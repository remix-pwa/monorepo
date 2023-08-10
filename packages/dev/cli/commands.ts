import { runCompiler } from '~/compiler.js';
import { FlagOptionType, createPWA } from './create.js';

export const dev = async (projectDir: string = process.cwd()) => {
  await runCompiler('dev', projectDir)
};

export const build = async (projectDir: string = process.cwd()) => {
  await runCompiler('build', projectDir)
};

export const push = async () => {};

export const init = async (dir: string, answer: FlagOptionType) => {
  await createPWA(dir, answer);
};
