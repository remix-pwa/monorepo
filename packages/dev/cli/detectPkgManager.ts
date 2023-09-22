import fse from 'fs-extra';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export type PackageManager = 'npm' | 'pnpm' | 'yarn';

export const detectPackageManager = async (projectDir: string): Promise<PackageManager | undefined> => {
  try {
    const [isNpm, isYarn, isPnpm] = await Promise.all([
      fse.pathExists(pathToFileURL(resolve(projectDir, 'package-lock.json')).href),
      fse.pathExists(pathToFileURL(resolve(projectDir, 'yarn.lock')).href),
      fse.pathExists(pathToFileURL(resolve(projectDir, 'pnpm-lock.yaml')).href),
    ]);

    if (isNpm) {
      return 'npm';
    } else if (isYarn) {
      return 'yarn';
    } else if (isPnpm) {
      return 'pnpm';
    }

    return undefined;
  } catch {
    return undefined;
  }
};
