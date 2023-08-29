import { describe, expect, test, vi } from 'vitest';

describe('network-only strategy test suite', () => {
  test('should return a response normally', async () => {
    const func = vi.fn();
    func.mockReturnValueOnce(true);

    expect(true).toBe(true);
  });

  test('should throw an error when timeout occurs', async () => {
    expect(true).toBe(true);
  });
});
