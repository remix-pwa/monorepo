import type { PWAPluginContext } from './types.js';

export function createContext(): PWAPluginContext {
  return {
    isDev: false,
    isReactRouterDevServer: false,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    __reactRouterPluginContext: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    options: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    viteConfig: undefined!,
  };
}
