import type { IncomingMessage, ServerResponse } from 'http';
import type { Connect, Plugin } from 'vite';

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

export function RemixPWA(pwaOptions: Partial<PWAOptions>): Plugin {
  return {
    name: 'remix-pwa-vite-plugin',
    enforce: 'pre',
    configResolved(config) {
      console.log('configResolved', config);
    },
    configureServer(server) {
      server.middlewares.use(
        (req: Connect.IncomingMessage, res: ServerResponse<IncomingMessage>, next: Connect.NextFunction) => {
          if (req.url?.includes('/@')) {
            return next();
          }

          console.log('req', req.url, req.method, req.headers);
          next();
        }
      );
    },
    async buildStart(options) {
      console.log('buildStart', options);

      // build service worker

      // inject required code into main app bundle
    },
  };
}
