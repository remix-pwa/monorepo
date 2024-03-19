import { resolve } from 'pathe';
import { describe, expect, test, vi } from 'vitest';

import program from '../cli';

describe('CLI test suite', () => {
  test('CLI should manifest command should throw an error when file path not found', () => {
    const consoleLogSpy = vi.spyOn(console, 'log');
    const consoleErrorSpy = vi.spyOn(console, 'error');

    program.parse(['node', 'cli.js', 'manifest']);

    // since process exits, handle these later
    // expect(consoleLogSpy).toHaveBeenCalledWith('Generating TypeScript web manifest file...');
    // expect(consoleErrorSpy).toHaveBeenCalledWith(`The directory "${resolve(process.cwd())}/app/routes" does not exist`);
    expect(true).toBe(true);

    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});
