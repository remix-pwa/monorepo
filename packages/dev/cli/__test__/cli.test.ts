import { afterAll, assert, beforeAll, describe, expect, test, vi } from 'vitest';

import { rmSync } from 'fs';
import { cpSync, existsSync, writeFileSync } from 'fs-extra';
import { resolve } from 'path';
import { createPWA } from '../create.js';
import { run } from '../run.js';
import { validate } from './utils/cli.js';

beforeAll(() => {
  process.env.NODE_ENV = 'test';

  const remixAppTemplate = resolve(__dirname, '../../../../templates/mock-remix-app');
  cpSync(remixAppTemplate, '__mock-app', { recursive: true });
});

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

  describe('Project creation test suite', () => {
    test('should point to the correct template directory', async () => {
      const log = vi.spyOn(console, 'log').mockImplementation(() => {});

      await createPWA('__mock-app', {
        dir: '__mock-app',
        precache: false,
        install: true,
        workbox: false,
        lang: 'ts',
        features: ['sw', 'manifest'],
        packageManager: 'npm',
      });

      expect(log).toHaveBeenCalled();
      expect(log).toHaveBeenCalledWith(expect.stringMatching('Integrating service worker...'));
      expect(log).toHaveBeenCalledWith(expect.stringMatching('manifest'));
    });

    test('should create an entry worker file when "sw" is specified', async () => {
      const log = vi.spyOn(console, 'log').mockImplementation(() => {});

      await createPWA('__mock-app', {
        dir: '__mock-app',
        precache: false,
        install: true,
        workbox: false,
        lang: 'ts',
        features: ['sw', 'manifest'],
        packageManager: 'npm',
      });

      assert.ok(existsSync('__mock-app/entry.worker.ts'));
      rmSync('__mock-app/entry.worker.ts'); // cleanup
    });

    test('should throw an error when the service worker already exists', async () => {
      const log = vi.spyOn(console, 'log').mockImplementation(() => {});

      writeFileSync('__mock-app/entry.worker.ts', 'console.log("hello world")');

      await createPWA('__mock-app', {
        dir: '__mock-app',
        precache: false,
        install: true,
        workbox: false,
        lang: 'ts',
        features: ['sw', 'manifest'],
        packageManager: 'npm',
      });

      expect(log).toHaveBeenCalled();
      expect(log).toHaveBeenCalledWith(expect.stringMatching('Service worker already exists'));

      rmSync('__mock-app/entry.worker.ts'); // cleanup
    });

    test("")
  });
});

afterAll(() => {
  rmSync('__mock-app', { recursive: true, force: true });
});
