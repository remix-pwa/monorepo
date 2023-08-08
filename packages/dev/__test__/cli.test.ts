import { jest } from '@jest/globals';

import { run } from '../cli/run.ts';

describe('CLI engine test suite', () => {
  describe('Argument test suite', () => {
    it('should provide a warning when no argument is passed', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      run([]);

      expect(warn).toHaveBeenCalled();
    });
  });

  describe('Version flag test suite', () => {
    it("should print the help text when the '--help' flag is passed", () => {
      const log = jest.spyOn(console, 'log').mockImplementation(() => {});
      run(['--help']);

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
    it("should print the help text when the '--docs' flag is passed", () => {
      const log = jest.spyOn(console, 'log').mockImplementation(() => {});
      run(['--docs']);

      expect(log).toHaveBeenCalled();
      expect(log).toHaveBeenCalledWith(expect.stringMatching('https://remix-pwa-docs.vercel.app'));
    });
  });

  describe('Prompt Test Suite', () => {
    it('1 is 1, I guess', () => {
      expect(1).toBe(1);
    });
  });
});
