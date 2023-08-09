import { FlagOptionType, createPWA } from './create.js';

export const dev = async (argv: string[] = process.argv.slice(2), projectDir: string = process.cwd()) => {};

export const build = async (argv: string[] = process.argv.slice(2), projectDir: string = process.cwd()) => {};

export const push = async () => {};

export const init = async (dir: string, answer: FlagOptionType) => {
  await createPWA(dir, answer);
};
