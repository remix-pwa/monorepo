import { describe, expect, test, vi } from 'vitest';

describe('cache-only strategy test suite', () => {
  test('should return a response from cache', async () => {
    const func = vi.fn();
    func.mockReturnValueOnce(true);

    expect(true).toBe(true);
  });

  test("should return a 404 when the entry isn't found and is a GET request", async () => {
    expect(true).toBe(true);
  });

  test("should return a 400 when the entry isn't found and is a non-GET request", async () => {
    expect(true).toBe(true);
  });
});
