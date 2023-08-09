import { createPWA } from './create.ts';

export const dev = async (argv: string[] = process.argv.slice(2), projectDir: string = process.cwd()) => {};

export const build = async (argv: string[] = process.argv.slice(2), projectDir: string = process.cwd()) => {};

export const push = async () => {};
// todo: typings
export const init = async (answer: any) => {
  await createPWA();
};
