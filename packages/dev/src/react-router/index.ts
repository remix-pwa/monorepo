import type { Plugin } from 'vite';

import { createContext } from './context.js';
import { LoaderPlugin } from './plugins/loader.js';
import { EntryPlugin } from './plugins/main.js';
import type { PWAOptions } from './types.js';

export function reactRouterPWA(pwaOptions: Partial<PWAOptions> = {}): Plugin[] {
  const ctx = createContext();

  return <Plugin[]>[EntryPlugin(ctx, pwaOptions), LoaderPlugin(ctx)];
}

export type { PWAOptions as PWAViteOptions };
