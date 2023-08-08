import { resolve } from 'path';

import { detectPackageManager } from '../cli/detectPkgManager.ts';

describe('Package Manager Test Suite', () => {
  it('should return undefined when no lock file is found', async () => {
    const pkgManager = await detectPackageManager(process.cwd());

    expect(pkgManager).toBe(undefined);
  });

  it('should return npm when package-lock.json is found', async () => {
    const pkgManager = await detectPackageManager(resolve(process.cwd(), '../../'));

    expect(pkgManager).toBe('npm');
  });
});
