import type { Plugin } from 'vite';

import { createContext } from './context.js';
import { CompilerPlugin } from './plugins/compiler.js';
import { LoaderPlugin } from './plugins/loader.js';
import { EntryPlugin } from './plugins/main.js';
import { StripRoutesPlugin } from './plugins/strip-routes.js';
import type { PWAOptions } from './types.js';

export function RemixPWA(pwaOptions: Partial<PWAOptions> = {}): Plugin[] {
  const ctx = createContext(pwaOptions);

  return <Plugin[]>[EntryPlugin(ctx), StripRoutesPlugin(ctx), CompilerPlugin(ctx), LoaderPlugin(ctx)];
}
