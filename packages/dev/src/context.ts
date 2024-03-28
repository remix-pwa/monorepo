import type { PWAPluginContext } from './types.js';

export function createContext(): PWAPluginContext {
  return {
    isDev: false,
    isRemixDevServer: false,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    __remixPluginContext: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    options: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    viteConfig: undefined!,
  };
}
