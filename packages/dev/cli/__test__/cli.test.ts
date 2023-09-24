import { rmSync } from 'fs';
import { cpSync, existsSync, readFileSync, writeFileSync } from 'fs-extra';
import { resolve } from 'path';
import { afterAll, assert, beforeAll, describe, expect, test, vi } from 'vitest';

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

A complete PWA framework solution for integrating PWA into your Remix application.
`)
      );
    });
  });

  describe('Documentation flag test suite', () => {
    test("should print the help text when the '--docs' flag is passed", async () => {
      const log = vi.spyOn(console, 'log').mockImplementation(() => {});
      await run(['--docs']);

      expect(log).toHaveBeenCalled();
      expect(log).toHaveBeenCalledWith(expect.stringMatching('https://remix-pwa.run'));
    });
  });

  describe('Project creation test suite', () => {
    test('should point to the correct template directory', async () => {
      const log = vi.spyOn(console, 'log').mockImplementation(() => {});

      await createPWA(
        '__mock-app',
        {
          precache: false,
          install: false,
          workbox: false,
          lang: 'ts',
          features: ['sw', 'manifest'],
          packageManager: 'npm',
        },
        true
      );

      expect(log).toHaveBeenCalled();
      // expect(log).toHaveBeenCalledWith(expect.stringMatching('Integrating Service Worker...'));
      // expect(log).toHaveBeenCalledWith(expect.stringMatching('Integrating Web Manifest...'));
    });

    describe('Service Worker creation suite', () => {
      test('should create an entry worker file when "sw" is specified', async () => {
        await createPWA(
          '__mock-app',
          {
            precache: false,
            install: false,
            workbox: false,
            lang: 'ts',
            features: ['sw', 'manifest'],
            packageManager: 'npm',
          },
          true
        );

        assert.ok(existsSync('__mock-app/app/entry.worker.ts'));
        expect(readFileSync('__mock-app/app/entry.worker.ts').toString()).toBe(
          readFileSync(resolve(__dirname, '../../../../templates/app/entry.worker.ts')).toString()
        );
        expect(true).toBe(true); // Added this line due to eslint error
      });

      test('should throw an error when the service worker already exists', async () => {
        const log = vi.spyOn(console, 'log').mockImplementation(() => {});

        writeFileSync('__mock-app/app/entry.worker.ts', 'console.log("hello world")', { flag: 'w' });

        await createPWA(
          '__mock-app',
          {
            precache: false,
            install: false,
            workbox: false,
            lang: 'ts',
            features: ['sw', 'manifest'],
            packageManager: 'npm',
          },
          true
        );

        expect(log).toHaveBeenCalled();
        expect(log).toHaveBeenCalledWith(expect.stringMatching('Service worker already exists'));
      });

      test('should create a precache service worker when precache is selected', async () => {
        rmSync('__mock-app', { recursive: true, force: true });
        cpSync(resolve(__dirname, '../../../../templates/mock-remix-app'), '__mock-app', { recursive: true });

        await createPWA(
          '__mock-app',
          {
            precache: true,
            install: false,
            workbox: false,
            lang: 'ts',
            features: ['sw', 'manifest'],
            packageManager: 'npm',
          },
          true
        );

        assert.ok(existsSync('__mock-app/app/entry.worker.ts'));

        const swContent = readFileSync('__mock-app/app/entry.worker.ts', 'utf-8');

        assert.ok(swContent.includes('const handler = new PrecacheHandler({'));
        expect(true).toBe(true);
      });
    });

    describe('Web Manifest creation suite', () => {
      test('should create a manifest file when "manifest" is specified', async () => {
        await createPWA(
          '__mock-app',
          {
            precache: false,
            install: false,
            workbox: false,
            lang: 'ts',
            features: ['sw', 'manifest'],
            packageManager: 'npm',
          },
          true
        );

        assert.ok(existsSync('__mock-app/app/routes/manifest[.]webmanifest.ts'));
        expect(true).toBe(true);
      });
    });
  });
});

afterAll(() => {
  rmSync('__mock-app', { recursive: true, force: true });
});
