import type { ResolvedRemixConfig } from '@remix-run/dev';
import { ServerMode } from '@remix-run/dev/dist/config/serverModes.js';
import { afterAll, afterEach, describe, expect, test, vi } from 'vitest';

const REMIX_ROOT = '.';
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
    vi.clearAllMocks();
  });
  afterAll(() => {
    vi.doUnmock('@remix-run/dev/dist/config');
    vi.doUnmock('./remix.config.ts');
  });

  test('should return the resolved config object with default worker options', async () => {
    vi.doMock('./remix.config.ts', () => {
      return { default: {} };
    });
    const { default: readConfig } = await import('../config.js');

    const config = await readConfig(REMIX_ROOT, ServerMode.Test);

    expect(config).toEqual({
      appDirectory: 'app',
      assetsBuildDirectory: 'public/build',
      entryWorkerFile: expect.stringContaining('entry.worker.js'),
      ignoredRouteFiles: ['**/.*'],
      serverModuleFormat: 'cjs',
      serverPlatform: 'node',
      worker: expect.stringContaining('service-worker.internal.js'),
      workerBuildDirectory: expect.stringContaining('public'),
      workerMinify: false,
      workerName: 'service-worker',
      workerSourcemap: false,
    });
  });

  test('should return the resolved config object with custom worker options', async () => {
    vi.doMock('./remix.config.ts', () => {
      return {
        default: {
          worker: 'custom-service-worker.js',
          workerMinify: true,
          workerName: 'sw',
          workerSourcemap: true,
        },
      };
    });
    const { default: readConfig } = await import('../config.js');
    const config = await readConfig(REMIX_ROOT, ServerMode.Test);

    expect(config).toEqual({
      appDirectory: 'app',
      assetsBuildDirectory: 'public/build',
      entryWorkerFile: expect.stringContaining('entry.worker.js'),
      ignoredRouteFiles: ['**/.*'],
      serverModuleFormat: 'cjs',
      serverPlatform: 'node',
      worker: 'custom-service-worker.js',
      workerBuildDirectory: expect.stringContaining('public'),
      workerMinify: true,
      workerName: 'sw',
      workerSourcemap: true,
    });
  });
});
