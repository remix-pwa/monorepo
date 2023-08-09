import { describe, expect, test, vi } from 'vitest';

import { run } from '../run.ts';
import { validate } from './utils/cli.ts';

describe('CLI engine test suite', () => {
  describe('Input validation', () => {
    test('should return true when a valid directory is passed', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [isValid, _] = validate('__test__', {}, process.cwd());

      expect(isValid).toBe(true);
    });
  });

  describe('Version flag test suite', () => {
    test("should print the help text when the '--help' flag is passed", async () => {
      const log = vi.spyOn(console, 'log').mockImplementation(() => {});
      await run(['--help']);

      expect(log).toHaveBeenCalled();
      expect(log).toHaveBeenCalledWith(
        expect.stringContaining(`
Usage:  npx remix-pwa@latest [OPTIONS]

A stand-alone package for integrating PWA solutions into Remix application.
`)
      );
    });
  });

  describe('Documentation flag test suite', () => {
    test("should print the help text when the '--docs' flag is passed", async () => {
      const log = vi.spyOn(console, 'log').mockImplementation(() => {});
      await run(['--docs']);

      expect(log).toHaveBeenCalled();
      expect(log).toHaveBeenCalledWith(expect.stringMatching('https://remix-pwa-docs.vercel.app'));
    });
  });

  describe('Prompt Test Suite', () => {
    test('1 is 1, I guess', () => {
      expect(1).toBe(1);
    });
  });
});
