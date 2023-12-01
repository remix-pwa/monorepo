import type { ResolvedConfig } from 'vite';

export type PWAOptions = {
  registerSW: 'script' | null;
  serviceWorkerSrc: string;
  publicDir: string;
  scope: string;
  minify: boolean;
};

export interface ResolvedPWAOptions extends Required<PWAOptions> {
  includeAssets: RegExp[];
  excludeAssets: RegExp[];
}

export interface PWAPluginContext {
  viteConfig: ResolvedConfig;
  pwaOptions: Partial<PWAOptions>;
  options: ResolvedPWAOptions;
  isDev: boolean;
}
