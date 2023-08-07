import { jest } from '@jest/globals';
import { findConfig, readConfig as _readConfig } from '@remix-run/dev/dist/config.js';
import type { ResolvedRemixConfig } from '@remix-run/dev';
import { ServerMode } from '@remix-run/dev/dist/config/serverModes.js';
import readConfig from '../config.js';

const REMIX_ROOT = '.';
var mockWorkerConfigModule = jest.fn();

jest.mock('@remix-run/dev/dist/config');
jest.mock(`./remix.config.ts`, () => ({
  default: mockWorkerConfigModule(),
}));

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
    mockWorkerConfigModule.mockReturnValue({});
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
    mockWorkerConfigModule.mockReturnValue({
      worker: 'custom-service-worker.js',
      workerMinify: true,
      workerName: 'sw.js',
      workerSourcemap: true,
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
});
