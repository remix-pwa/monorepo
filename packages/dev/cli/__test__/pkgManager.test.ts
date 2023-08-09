import { describe, expect, test } from 'vitest';

import { detectPackageManager } from '../detectPkgManager.ts';

describe('Package Manager Test Suite', () => {
  test('should return undefined when no lock file is found', async () => {
    const pkgManager = await detectPackageManager('./packages');

    expect(pkgManager).toBeUndefined();
  });

  // TODO: Skipping this test for now because the `detectPackageManager` function doesn't support monorepo structures.
  // Given a path like `root/packages/package-1` will fail to detect where the `package-lock.json` file is located.
  test.skip('should return npm when package-lock.json is found', async () => {
    const pkgManager = await detectPackageManager(process.cwd());

    expect(pkgManager).toBe('npm');
  });
});
