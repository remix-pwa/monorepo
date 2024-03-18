import { describe, expect, test, vi } from 'vitest';

import program from '../cli';

describe('CLI test suite', () => {
  test('CLI should generate default manifest when prompted', () => {
    const consoleSpy = vi.spyOn(console, 'log');

    program.parse(['node', 'cli.js', 'manifest']);

    expect(consoleSpy).toHaveBeenCalledWith('Generating web manifest file...', { ts: true, js: undefined });

    consoleSpy.mockRestore();
  });
});
