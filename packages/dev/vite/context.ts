import type { ResolvedConfig } from 'vite';

import type { PWAOptions } from './types.js';

export interface PWAPluginContext {
  viteConfig: ResolvedConfig;
  pwaOptions: Partial<PWAOptions>;
  options: Partial<PWAOptions>;
  isDev: boolean;
}

export function createContext(options: Partial<PWAOptions>): PWAPluginContext {
  return {
    isDev: false,
    options,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    pwaOptions: undefined!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    viteConfig: undefined!,
  };
}
