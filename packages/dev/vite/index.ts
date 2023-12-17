import type { Plugin } from 'vite';

import { createContext } from './context.js';
import { CompilerPlugin } from './plugins/compiler.js';
import { EntryVModPlugin } from './plugins/entry.js';
import { LoaderPlugin } from './plugins/loader.js';
import { EntryPlugin } from './plugins/main.js';
import { RoutesVModPlugin } from './plugins/routes.js';
import type { PWAOptions } from './types.js';

/**
 * The way this would work is:
 *
 * RemixPwa({
 *  registerSW: 'script' | null,
 * })
 */

export function RemixPWA(pwaOptions: Partial<PWAOptions> = {}): Plugin[] {
  const ctx = createContext(pwaOptions);

  return <Plugin[]>[
    EntryPlugin(ctx),
    CompilerPlugin(ctx),
    LoaderPlugin(ctx),
    EntryVModPlugin(ctx),
    RoutesVModPlugin(ctx),
  ];
}
