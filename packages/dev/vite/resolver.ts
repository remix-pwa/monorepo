import type { ResolvedConfig } from 'vite';

import type { PWAOptions } from './types.js';

export function resolveOptions(options: Partial<PWAOptions>, viteConfig: ResolvedConfig) {
  const { registerSW = 'auto', serviceWorker = 'service-worker.js' } = options;
}
