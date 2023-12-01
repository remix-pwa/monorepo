import type { ResolvedConfig } from 'vite';
import { normalizePath } from 'vite';

import type { PWAOptions, ResolvedPWAOptions } from './types.js';

export async function resolveOptions(
  options: Partial<PWAOptions>,
  viteConfig: ResolvedConfig
): Promise<ResolvedPWAOptions> {
  const {
    minify = options.minify || false,
    publicDir = options.publicDir ||
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- viteConfig.publicDir is always defined
      normalizePath(viteConfig.publicDir).split(normalizePath(viteConfig.root)).pop()!,
    registerSW = options.registerSW || 'script',
    scope = options.scope || viteConfig.base,
    serviceWorkerSrc = (options.serviceWorkerSrc || 'entry.worker.ts').trim(),
  } = options;

  const includeAssets = [/\.(js|css|html|svg|png|jpg|jpeg|webp)$/];
  const excludeAssets = [/\.map$/, /^manifest.*\.json$/, /^sw\.js$/];

  return {
    minify,
    publicDir: publicDir.replace(/^\/|\/$/g, ''),
    registerSW,
    scope,
    serviceWorkerSrc: serviceWorkerSrc.replace(/^\/|\/$/g, ''),
    includeAssets,
    excludeAssets,
  };
}
