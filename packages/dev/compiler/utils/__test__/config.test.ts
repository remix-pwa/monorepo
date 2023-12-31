import type { ResolvedRemixConfig } from '@remix-run/dev';
import { ServerMode } from '@remix-run/dev/dist/config/serverModes.js';
import { afterAll, afterEach, describe, expect, test, vi } from 'vitest';

const REMIX_ROOT = '.';
const mockResolve = vi.hoisted(() => vi.fn());
const mockExists = vi.hoisted(() => vi.fn());

vi.doMock('node:path', () => ({
  normalize: (path: string) => path,
  resolve: mockResolve,
}));
vi.doMock('node:fs', () => ({
  existsSync: mockExists,
  statSync: () => ({ mtimeMs: 123456789 }),
}));
vi.mock('node:url', () => ({
  pathToFileURL: () => ({ href: './__test__/remix.config.ts' }),
}));
vi.doMock('@remix-run/dev/dist/config.js', () => {
  return {
    readConfig: () =>
      Promise.resolve({
        appDirectory: 'app',
        assetsBuildDirectory: 'public/build',
        ignoredRouteFiles: ['**/.*'],
        serverPlatform: 'node',
        serverModuleFormat: 'cjs',
      } as unknown as ResolvedRemixConfig),
    findConfig: () => './__test__/remix.config.ts',
  };
});
vi.doMock('node:module', async () => ({
  createRequire: () => ({ resolve: () => 'service-worker.internal.js' }),
}));

describe('readConfig', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  afterAll(() => {
    vi.doUnmock('@remix-run/dev/dist/config');
    vi.doUnmock('./remix.config.ts');
    vi.doUnmock('node:fs');
    vi.doUnmock('node:path');
    vi.doUnmock('node:url');
  });

  test('should return the resolved config object with default worker options', async () => {
    mockResolve.mockReturnValue('public').mockReturnValueOnce('entry.worker.ts').mockReturnValueOnce('entry.worker.ts');
    mockExists.mockReturnValue(false);

    vi.doMock('./remix.config.ts', () => {
      return { default: {} };
    });
    const { default: readConfig } = await import('../config.js');

    const config = await readConfig(REMIX_ROOT, ServerMode.Test);

    expect(config).toEqual({
      appDirectory: 'app',
      assetsBuildDirectory: 'public/build',
      entryWorkerFile: expect.stringContaining('entry.worker.ts'),
      ignoredRouteFiles: ['**/.*'],
      serverModuleFormat: 'cjs',
      serverPlatform: 'node',
      worker: 'service-worker.internal.js',
      workerBuildDirectory: expect.stringContaining('public'),
      workerMinify: false,
      workerName: 'entry.worker',
      workerSourcemap: false,
    });
  });

  test('should find the user entry file', async () => {
    mockResolve.mockReturnValue('mock.entry.worker.js');
    mockExists.mockReturnValue(true);

    vi.doMock('./remix.config.ts', () => {
      return { default: {} };
    });

    const { default: readConfig } = await import('../config.js');
    const config = await readConfig(REMIX_ROOT, ServerMode.Test);

    expect(config).toHaveProperty('entryWorkerFile', 'mock.entry.worker.js');
  });

  test('should return the resolved config object with custom worker options', async () => {
    mockResolve.mockReturnValue(undefined);
    mockExists.mockReturnValue(false);

    vi.doMock('./remix.config.ts', () => {
      return {
        default: {
          worker: 'custom-service-worker.js',
          workerMinify: true,
          workerName: 'sw',
          workerSourcemap: true,
          workerBuildDirectory: 'customer-build-directory/',
        },
      };
    });
    const { default: readConfig } = await import('../config.js');
    const config = await readConfig(REMIX_ROOT, ServerMode.Test);

    expect(config).toEqual({
      appDirectory: 'app',
      assetsBuildDirectory: 'public/build',
      entryWorkerFile: expect.stringContaining('entry.worker.ts'),
      ignoredRouteFiles: ['**/.*'],
      serverModuleFormat: 'cjs',
      serverPlatform: 'node',
      worker: 'custom-service-worker.js',
      workerBuildDirectory: expect.stringContaining('customer-build-directory'),
      workerMinify: true,
      workerName: 'sw',
      workerSourcemap: true,
    });
  });
});
