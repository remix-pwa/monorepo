import fse from 'fs-extra';
import { resolve } from 'node:path';

export type PackageManager = 'npm' | 'pnpm' | 'yarn';

export const detectPackageManager = async (projectDir: string): Promise<PackageManager | undefined> => {
  try {
    const [isNpm, isYarn, isPnpm] = await Promise.all([
      fse.pathExists(resolve(projectDir, 'package-lock.json')),
      fse.pathExists(resolve(projectDir, 'yarn.lock')),
      fse.pathExists(resolve(projectDir, 'pnpm-lock.yaml')),
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
