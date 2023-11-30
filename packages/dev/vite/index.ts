import type { Plugin } from 'vite';

import { LoaderPlugin } from './loader.js';

export type PWAOptions = {
  registerSW: 'script' | 'none' | 'auto';
};

/**
 * The way this would work is:
 *
 * RemixPwa({
 *  registerSW: 'script' | 'none' | 'auto',
 * })
 */

export function RemixPWA(pwaOptions: Partial<PWAOptions> = {}): Plugin[] {
  return <Plugin[]>[LoaderPlugin(pwaOptions)];
}
