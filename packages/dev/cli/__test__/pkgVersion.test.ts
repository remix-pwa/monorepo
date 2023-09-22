import { describe, expect, test } from 'vitest';

import { getPkgVersion } from '../getPkgVersion.js';

describe('Package Version Test Suite', () => {
  test('should return the latest version of an existing package', async () => {
    const pkgVersion = getPkgVersion('create-react-class');

    expect(pkgVersion).toBe('15.7.0');
  });
});
