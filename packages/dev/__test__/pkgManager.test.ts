import { detectPackageManager } from '../cli/detectPkgManager.ts';

describe('Package Manager Test Suite', () => {
  it('should return undefined when no lock file is found', async () => {
    const pkgManager = await detectPackageManager('./packages');

    expect(pkgManager).toBe(undefined);
  });

  it('should return npm when package-lock.json is found', async () => {
    const pkgManager = await detectPackageManager(process.cwd());

    expect(pkgManager).toBe('npm');
  });
});
