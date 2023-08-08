import { jest } from '@jest/globals';
import type { ResolvedRemixConfig } from '@remix-run/dev';
import { readConfig as _readConfig, findConfig } from '@remix-run/dev/dist/config.js';
import { ServerMode } from '@remix-run/dev/dist/config/serverModes.js';

import readConfig from '../config';

const REMIX_ROOT = '.';

jest.mock('@remix-run/dev/dist/config.js');
jest.mocked(_readConfig).mockResolvedValue({
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  ignoredRouteFiles: ['**/.*'],
  serverPlatform: 'node',
  serverModuleFormat: 'cjs',
} as unknown as ResolvedRemixConfig);
jest.mocked(findConfig).mockReturnValue('./__test__/remix.config.ts');

describe('readConfig', () => {
  afterAll(() => {
    jest.unmock('@remix-run/dev/dist/config');
    jest.unmock(`./remix.config.ts`);
  });

  it('should return the resolved config object with default worker options', async () => {
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

  it('should return the resolved config object with custom worker options', async () => {
    jest.mock(`./remix.config.ts`, () => {
      return {
        default: {
          worker: 'custom-service-worker.js',
          workerMinify: true,
          workerName: 'sw',
          workerSourcemap: true,
        },
      };
    });
    const { default: readConfig } = await import('../config');
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
