import { platform } from 'os';
import { resolve } from 'path';
import { pathToFileURL } from 'url';

const isWindows = platform() === 'win32';

export const resolveUrl = (...args: string[]) => {
  const url = resolve(...args)
  return !isWindows ? url : (isAbsolute(url) ? pathToFileURL(url).href : url);
};

export const isAbsolute = (path: string) => {
  return !isWindows ? resolve(path) === path : pathToFileURL(resolve(path)).href === path;
}