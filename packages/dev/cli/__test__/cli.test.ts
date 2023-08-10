import { afterAll, afterEach, assert, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { rmSync } from 'fs';
import { cpSync, existsSync, readFileSync, writeFileSync } from 'fs-extra';
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
        dir: 'app',
        precache: false,
        install: false,
        workbox: false,
        lang: 'ts',
        features: ['sw', 'manifest'],
        packageManager: 'npm',
      });

      expect(log).toHaveBeenCalled();
      expect(log).toHaveBeenCalledWith(expect.stringMatching('Integrating Service Worker...'));
      expect(log).toHaveBeenCalledWith(expect.stringMatching('Integrating Web Manifest...'));
    });

    // Bug: Tests in this suite are broken
    describe('Service Worker creation suite', () => {
      beforeEach(() => {
        const remixAppTemplate = resolve(__dirname, '../../../../templates/mock-remix-app');
        cpSync(remixAppTemplate, '__mock-app', { recursive: true, force: true });
      });

      test.skip('should create an entry worker file when "sw" is specified', async () => {
        await createPWA('__mock-app', {
          dir: 'app',
          precache: false,
          install: false,
          workbox: false,
          lang: 'ts',
          features: ['sw', 'manifest'],
          packageManager: 'npm',
        });

        assert.ok(existsSync('__mock-app/app/entry.worker.ts'));
      });

      test.skip('should throw an error when the service worker already exists', async () => {
        const log = vi.spyOn(console, 'log').mockImplementation(() => {});

        writeFileSync('__mock-app/app/entry.worker.ts', 'console.log("hello world")');

        await createPWA('__mock-app', {
          dir: 'app',
          precache: false,
          install: false,
          workbox: false,
          lang: 'ts',
          features: ['sw', 'manifest'],
          packageManager: 'npm',
        });

        expect(log).toHaveBeenCalled();
        expect(log).toHaveBeenCalledWith(expect.stringMatching('Service worker already exists'));
      });

      test.skip('should create a precache service worker when precache is selected', async () => {
        await createPWA('__mock-app', {
          dir: 'app',
          precache: true,
          install: false,
          workbox: false,
          lang: 'ts',
          features: ['sw', 'manifest'],
          packageManager: 'npm',
        });

        assert.ok(existsSync('__mock-app/app/entry.worker.ts'));

        const swContent = readFileSync('__mock-app/app/entry.worker.ts', 'utf-8');

        assert.ok(swContent.includes('// Precache Worker'));
      });

      afterEach(() => {
        rmSync('__mock-app', { recursive: true, force: true });
      });
    });

    describe('Web Manifest creation suite', () => {
      test('should create a manifest file when "manifest" is specified', async () => {
        await createPWA('__mock-app', {
          dir: 'app',
          precache: false,
          install: false,
          workbox: false,
          lang: 'ts',
          features: ['sw', 'manifest'],
          packageManager: 'npm',
        });

        assert.ok(existsSync('__mock-app/app/routes/manifest[.]webmanifest.ts'));
      });
    });
  });
});

afterAll(() => {
  rmSync('__mock-app', { recursive: true, force: true });
});
