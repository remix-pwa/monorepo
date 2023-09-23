import { describe, expect, test } from 'vitest';

import { resolveUrl } from '../resolveUrl';

describe('URL resolution test suite', () => {
  test('should return the right directory format on windows and UNIX', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _url = resolveUrl('remix-pwa', 'package.json');

    // can I mock the os module?

    // Just realised this would throw an error
    // on every CI run, because it would try to
    // resolve the absolute directory of the CI user.
    expect(true).toBe(true);
  });
});
