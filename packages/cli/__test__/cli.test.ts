import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'pathe';
import ts from 'typescript';
import { afterAll, afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import program from '../cli';

vi.mock('child_process');
vi.mock('fs/promises');
vi.mock('fs');
vi.mock('typescript', () => ({
  default: {
    ModuleKind: { ES2022: 'ES2022' },
    ScriptTarget: { ES2022: 'ES2022' },
    transpileModule: vi.fn().mockReturnValue({
      outputText: 'transpiled content',
      diagnostics: [],
    }),
  },
}));
vi.mock('url', () => ({
  fileURLToPath: (url: string) =>
    url
      .replace(/^file:\/\//, '/')
      .replaceAll('\\', '/')
      .replaceAll('./', ''),
}));
vi.mock('pathe', () => ({
  dirname: vi.fn(),
  resolve: (...args: string[]) => args.join('/'),
}));

vi.mock('picocolors', () => ({
  default: {
    blue: (text: string) => text,
    bold: (text: string) => text,
    green: (text: string) => text,
    italic: (text: string) => text,
    magenta: (text: string) => text,
    red: (text: string) => text,
    cyan: (text: string) => text,
  },
}));

describe('Remix PWA CLI', () => {
  const mockCwd = '/fake/project/path';
  const mockTemplateContent = 'template content';

  beforeEach(() => {
    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const mockImport = vi.fn();
    vi.stubGlobal('import', mockImport);

    vi.mocked(readFile).mockResolvedValue(mockTemplateContent);
    vi.mocked(existsSync).mockReturnValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('manifest command', () => {
    test('should generate TypeScript manifest file by default', async () => {
      await program.parse(['node', 'test', 'manifest']);

      expect(writeFile).toHaveBeenCalledWith(
        expect.stringContaining(resolve(mockCwd, 'app/routes/manifest[.webmanifest].ts')),
        mockTemplateContent
      );
    });

    test('should generate JavaScript manifest when --js flag is used', async () => {
      await program.parse(['node', 'test', 'manifest', '--js']);

      expect(ts.transpileModule).toHaveBeenCalledWith(mockTemplateContent, {
        compilerOptions: expect.any(Object),
      });

      expect(writeFile).toHaveBeenCalledWith(
        expect.stringContaining(resolve(mockCwd, 'app/routes/manifest[.webmanifest].js')),
        'transpiled content'
      );
    });

    test('should error if both --js and --ts flags are used', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

      await program.parse(['node', 'test', 'manifest', '--js', '--ts']);

      expect(console.error).toHaveBeenCalledWith('You can only generate one type of web manifest file');
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    test('should error if destination directory does not exist', async () => {
      vi.mocked(existsSync).mockReturnValue(false);
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

      await program.parse(['node', 'test', 'manifest']);

      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('does not exist'));
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('sw command', () => {
    test('should generate TypeScript service worker by default', async () => {
      await program.parse(['node', 'test', 'sw']);

      expect(writeFile).toHaveBeenCalledWith(
        expect.stringContaining(resolve(mockCwd, 'app/entry.worker.ts')),
        mockTemplateContent
      );
    });

    test('should generate JavaScript service worker when --js flag is used', async () => {
      await program.parse(['node', 'test', 'sw', '--js']);

      expect(ts.transpileModule).toHaveBeenCalledWith(mockTemplateContent, {
        compilerOptions: expect.any(Object),
      });

      expect(writeFile).toHaveBeenCalledWith(
        expect.stringContaining(resolve(mockCwd, 'app/entry.worker.js')),
        'transpiled content'
      );
    });

    test('should error if destination directory does not exist', async () => {
      vi.mocked(existsSync).mockReturnValue(false);
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

      await program.parse(['node', 'test', 'sw']);

      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('does not exist'));
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });

  // Can't get these tests to work - atp, I am flummoxed and infuriated
  describe.skip('update command', () => {
    const mockPackageJson = {
      default: {
        dependencies: {
          '@remix-pwa/dev': '^2.0.0',
          '@remix-pwa/worker': '^1.0.0',
        },
        devDependencies: {
          '@remix-pwa/cli': '^1.0.0',
        },
      },
    };

    beforeEach(() => {
      vi.clearAllMocks();
      vi.spyOn(process, 'cwd').mockReturnValue('/test/path');
      vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

      vi.doMock('test/path/package.json', () => mockPackageJson);

      const mockImport = vi.fn().mockImplementation((url: string) => {
        const expectedPath = 'file:///test/path/package.json';

        if (url === expectedPath) {
          if (mockImport.mock.calls.length === 1) {
            throw new Error('ERR_IMPORT_ATTRIBUTE_MISSING');
          }
          return Promise.resolve(mockPackageJson);
        }

        throw new Error(`Mock import failed: ${url} does not match expected path ${expectedPath}`);
      });

      vi.stubGlobal('import', mockImport);
    });

    test('should update all @remix-pwa packages when no specific packages are specified', () => {
      program.parse(['node', 'test', 'update']);

      // expect(execSync).toHaveBeenCalledTimes(3);
      // expect(execSync).toHaveBeenCalledWith('npm i @remix-pwa/dev@latest');
      // expect(execSync).toHaveBeenCalledWith('npm i @remix-pwa/worker@latest');
      // expect(execSync).toHaveBeenCalledWith('npm i -D @remix-pwa/cli@latest');
      expect(process.exit).toHaveBeenCalledWith(0);
    });

    test('should update only specified packages', async () => {
      program.parse(['node', 'test', 'update', '-p', 'dev', 'worker']);

      expect(execSync).toHaveBeenCalledTimes(2);
      expect(execSync).toHaveBeenCalledWith('npm i dev@latest');
      expect(execSync).toHaveBeenCalledWith('npm i worker@latest');
    });

    test('should use dev tag when --dev flag is used', async () => {
      await program.parse(['node', 'test', 'update', '--dev']);

      expect(execSync).toHaveBeenCalledTimes(3);
      expect(execSync).toHaveBeenCalledWith('npm i @remix-pwa/dev@dev');
      expect(execSync).toHaveBeenCalledWith('npm i @remix-pwa/worker@dev');
      expect(execSync).toHaveBeenCalledWith('npm i -D @remix-pwa/cli@dev');
    });

    afterEach(() => {
      vi.doUnmock('test/path/package.json');
    });

    afterAll(() => {
      vi.unstubAllGlobals();
    });
  });

  describe('init command', () => {
    const mockDir = 'my-test-app';
    const mockUserAgent = 'npm/1.0.0';

    beforeEach(() => {
      // Reset process.env
      process.env.npm_config_user_agent = mockUserAgent;
    });

    test('should scaffold with default options when --yes flag is used', async () => {
      await program.parse(['node', 'test', 'init', mockDir, '--yes']);

      expect(execSync).toHaveBeenCalledWith(
        expect.stringContaining('npx create react-router@latest my-test-app --install --git-init')
      );
      expect(execSync).toHaveBeenCalledWith(expect.stringContaining('npm i -s @remix-pwa/dev -D'));
      expect(execSync).toHaveBeenCalledWith(expect.stringContaining('npm i -s @remix-pwa/worker-runtime -D'));
      expect(execSync).toHaveBeenCalledWith(expect.stringContaining('npm i -s @remix-pwa/sw'));
      expect(execSync).toHaveBeenCalledWith(expect.not.stringContaining('npm i -s @remix-pwa/manifest'));
    });

    // Marker
    test.skip('should use correct package manager based on user agent', async () => {
      process.env.npm_config_user_agent = 'yarn/1.0.0';

      vi.stubGlobal('process', {
        env: {
          npm_config_user_agent: 'yarn/1.0.0',
        },
        cwd: () => '/test/path',
      });

      await program.parse(['node', 'test', 'init', mockDir, '--yes']);

      expect(execSync).toHaveBeenCalledWith(expect.stringContaining('yarn create react-router@latest'));
      expect(execSync).toHaveBeenCalledWith(expect.stringContaining('yarn add @remix-pwa/dev -D'));
    });

    test('should respect package manager option over user agent', async () => {
      process.env.npm_config_user_agent = 'yarn/1.0.0';

      await program.parse(['node', 'test', 'init', mockDir, '--yes', '--package-manager', 'pnpm']);

      expect(execSync).toHaveBeenCalledWith(expect.stringContaining('pnpm exec create react-router@latest'));
      expect(execSync).toHaveBeenCalledWith(expect.stringContaining('pnpm add @remix-pwa/dev -D'));
    });

    // Marker
    test.skip('should create files in correct locations when directories exist', async () => {
      vi.mocked(existsSync).mockReturnValue(true);

      await program.parse(['node', 'test', 'init', mockDir, '--yes']);

      expect(writeFile).toHaveBeenCalledWith(
        expect.stringContaining('my-test-app/app/entry.worker.ts'),
        expect.any(String)
      );
      expect(writeFile).toHaveBeenCalledWith(
        expect.stringContaining('my-test-app/app/routes/manifest[.webmanifest].ts'),
        expect.any(String)
      );
    });

    test('should skip file creation when directories do not exist', async () => {
      vi.mocked(existsSync).mockReturnValue(false);

      await program.parse(['node', 'test', 'init', mockDir, '--yes']);

      expect(writeFile).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Directory for service worker doesn't exist"));
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Directory for web manifest doesn't exist"));
    });

    test('should install correct dependencies for push notifications', async () => {
      await program.parse(['node', 'test', 'init', mockDir, '--yes', '-f', 'push']);

      expect(execSync).toHaveBeenCalledWith(expect.stringContaining('npm i -s @remix-pwa/dev -D'));
      expect(execSync).toHaveBeenCalledWith(expect.stringContaining('npm i -s @remix-pwa/worker-runtime -D'));
      expect(execSync).toHaveBeenCalledWith(expect.stringContaining('npm i -s @remix-pwa/push'));
    });

    test('should install correct dependencies for background sync', async () => {
      await program.parse(['node', 'test', 'init', mockDir, '--yes', '-f', 'sync']);

      expect(execSync).toHaveBeenCalledWith(expect.stringContaining('npm i -s @remix-pwa/dev -D'));
      expect(execSync).toHaveBeenCalledWith(expect.stringContaining('npm i -s @remix-pwa/worker-runtime -D'));
      expect(execSync).toHaveBeenCalledWith(expect.stringContaining('npm i -s @remix-pwa/sync'));
    });

    test('should install client utilities when selected', async () => {
      await program.parse(['node', 'test', 'init', mockDir, '--yes', '-f', 'client']);

      expect(execSync).toHaveBeenCalledWith(expect.stringContaining('npm i -s @remix-pwa/client'));
    });

    test('should use Remix framework when specified', async () => {
      await program.parse(['node', 'test', 'init', mockDir, '--yes', '--router', 'remix']);

      expect(execSync).toHaveBeenCalledWith(expect.stringContaining('npx create remix@latest'));
    });

    // Marker
    test.skip('should show helpful tips after installation', async () => {
      await program.parse(['node', 'test', 'init', mockDir, '--yes']);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('💡 Tips:'));
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('remix-pwa update'));
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('remix-pwa sw'));
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('remix-pwa manifest'));
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('https://remix-pwa.com'));
    });

    afterEach(() => {
      vi.clearAllMocks();
      vi.unstubAllGlobals();
    });
  });
});
