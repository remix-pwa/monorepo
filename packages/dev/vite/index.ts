import type { Plugin } from 'vite';

import { createContext } from './context.js';
import { BundlerPlugin } from './plugins/bundler.js';
import { LoaderPlugin } from './plugins/loader.js';
import { EntryPlugin } from './plugins/main.js';
import type { PWAOptions } from './types.js';

export function RemixPWA(pwaOptions: Partial<PWAOptions> = {}): Plugin[] {
  const ctx = createContext(pwaOptions);

  return <Plugin[]>[EntryPlugin(ctx), BundlerPlugin(ctx)];
}
