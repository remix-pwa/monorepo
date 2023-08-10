import { pathExists } from 'fs-extra';
import { resolve } from 'path';

/**
 * Validate the input from the user
 *
 * @param input The input from the user
 * @param answers The answers from the user
 * @param projectDir The project directory
 */
export function validate(input: string, answers: any, projectDir: string): [boolean, any] | string {
  if (input === '') {
    return 'Please enter a valid directory';
  }

  pathExists(resolve(projectDir, input)).then(exists => {
    if (!exists) {
      return 'Please enter a valid directory';
    }
  });

  if (input.startsWith('/') || input.endsWith('/')) {
    answers!.dir = input.replace(/^\/|\/$/g, '');
  }

  return [true, answers];
}
