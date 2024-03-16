import { afterAll, afterEach, assert, beforeAll, describe, expect, test, vi } from 'vitest';

import type { ResolvedPWAOptions } from '../types.js';

vi.doMock('crypto', () => {
  return {
    createHash: () => ({
      update: () => ({
        digest: () => 'd41d8cd98f00b204e9800998ecf8427e',
      }),
    }),
  };
});
vi.doMock('pathe', () => ({
  join: () => './__test__/hash.test.ts',
}));
vi.doMock('fs', () => ({
  readFileSync: () => 'console.log("Hello World!")',
}));

describe('File Hashing test suite', () => {
  beforeAll(() => {
    vi.doMock('../hash.js', () => {
      return {
        getWorkerHash: vi.fn().mockReturnValue('d41d8cd98f00b204e9800998ecf8427e'),
        compareHash: (hot: any, oldHash: string, newHash: string) => {
          if (oldHash === newHash) {
            return;
          }

          hot.send({
            type: 'custom',
            event: 'pwa:worker-reload',
            data: {
              oldHash,
              newHash,
            },
          });
        },
      };
    });
  });

  test('should hash a file', async () => {
    const { getWorkerHash } = await import('../hash.js');

    const hash = getWorkerHash({ workerBuildDirectory: './__test__', workerName: 'hash' } as ResolvedPWAOptions);

    assert(hash);
    expect(hash).toBe('d41d8cd98f00b204e9800998ecf8427e');
  });

  test('should not send data to the client when hashes are unchanged', async () => {
    const { compareHash } = await import('../hash.js');

    const ws = {
      send: vi.fn(),
    };

    compareHash(ws as any, 'd41d8cd98f00b204e9800998ecf8427e', 'd41d8cd98f00b204e9800998ecf8427e');

    expect(ws.send).not.toHaveBeenCalled();
  });

  test('should send data to the client when hashes are changed', async () => {
    const { compareHash } = await import('../hash.js');

    const ws = {
      send: vi.fn(),
    };

    compareHash(ws as any, '5db838rhee3uh93o3jf9aodui41ls', 'd41d8cd98f00b204e9800998ecf8427e');

    expect(ws.send).toHaveBeenCalled();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.doUnmock('crypto');
    vi.doUnmock('pathe');
    vi.doUnmock('fs');
    vi.doUnmock('../hash.js');
  });
});
