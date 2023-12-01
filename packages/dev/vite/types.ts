import type { ResolvedConfig } from 'vite';

export type PWAOptions = {
  registerSW: 'script' | 'none' | 'auto';
  serviceWorker: string;
};

export interface PWAPluginContext {
  viteConfig: ResolvedConfig;
  pwaOptions: Partial<PWAOptions>;
  options: Partial<PWAOptions>;
  isDev: boolean;
}
