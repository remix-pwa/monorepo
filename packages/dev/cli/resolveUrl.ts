import { platform } from 'os';
import { resolve } from 'path';
import { pathToFileURL } from 'url';

const isWindows = platform() === 'win32';

export const resolveUrl = (...args: string[]) => {
  return !isWindows ? resolve(...args) : pathToFileURL(resolve(...args)).href;
};
