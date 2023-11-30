import type { Plugin } from 'vite';

import { createContext } from './context.js';
import { LoaderPlugin } from './plugins/loader.js';
import { EntryPlugin } from './plugins/main.js';
import type { PWAOptions } from './types.js';

/**
 * The way this would work is:
 *
 * RemixPwa({
 *  registerSW: 'script' | 'none' | 'auto',
 * })
 */

export function RemixPWA(pwaOptions: Partial<PWAOptions> = {}): Plugin[] {
  const ctx = createContext(pwaOptions);

  return <Plugin[]>[EntryPlugin(ctx), LoaderPlugin(ctx)];
}
