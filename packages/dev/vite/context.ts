import type { ResolvedConfig } from 'vite';

import type { PWAOptions, PWAPluginContext } from './types.js';

export function createContext(pwaOptions: Partial<PWAOptions>): PWAPluginContext {
  return {
    isDev: false,
    pwaOptions,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    options: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    viteConfig: undefined!,
  };
}
