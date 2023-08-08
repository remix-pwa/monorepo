import { pathExists } from 'fs-extra';
import path from 'node:path';

export type PackageManager = 'npm' | 'pnpm' | 'yarn';

export const detectPackageManager = async (projectDir: string): Promise<PackageManager | undefined> => {
  try {
    const [isNpm, isYarn, isPnpm] = await Promise.all([
      pathExists(path.resolve(projectDir, 'package-lock.json')),
      pathExists(path.resolve(projectDir, 'yarn.lock')),
      pathExists(path.resolve(projectDir, 'pnpm-lock.yaml')),
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
