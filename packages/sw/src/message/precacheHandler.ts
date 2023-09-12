/* eslint-disable prefer-const */
import { Storage } from '@remix-pwa/cache';
import type { AssetsManifest } from '@remix-run/dev';
import type { EntryRoute } from '@remix-run/react/dist/routes.js';

import { logger } from '../private/logger.js';
import type { MessageHandlerParams } from './message.js';
import { MessageHandler } from './message.js';

/**
 * The state of the precache handler.
 *
 * Takes in additional payload (information) to pass to the handler.
 */
export interface PrecacheHandlerState {
  /**
   * An array of routes to ignore when precaching.
   *
   * Can be an array of strings, regex patterns, or functions that takes in a route of type
   * {@link https://github.com/remix-run/remix/blob/97d82db0556ba8b40518898a75d6838e0bf3ced1/packages/remix-react/routes.tsx#L38 EntryRoute}
   * as argument and returns `boolean`. Or just a single function.
   *
   * *Example with strings*:
   * ```ts
   * ignoredRoutes: [
   *  "/catch",
   *  "/error",
   * ]
   * ```
   *
   * *Example with functions*:
   * ```ts
   * ignoredRoutes: [
   *  (route) => route.id.includes("dashboard")
   * ]
   * ```
   */
  ignoredRoutes?: RegExp[] | string[] | ((route: EntryRoute) => boolean)[] | ((route: EntryRoute) => boolean) | null;
}

export interface PrecacheHandlerOptions extends Omit<MessageHandlerParams, 'state'> {
  dataCacheName: string;
  documentCacheName: string;
  assetCacheName: string;
  state?: PrecacheHandlerState;
}

export class PrecacheHandler extends MessageHandler {
  dataCacheName: string;
  documentCacheName: string;
  assetCacheName: string;

  private _ignoredFiles: PrecacheHandlerState['ignoredRoutes'] = null;

  constructor({ assetCacheName, dataCacheName, documentCacheName, plugins, state }: PrecacheHandlerOptions) {
    super({ plugins, state: {} });

    this.dataCacheName = dataCacheName;
    this.documentCacheName = documentCacheName;
    this.assetCacheName = assetCacheName;
    this._handleMessage = this._handleMessage.bind(this);
    this._ignoredFiles = state?.ignoredRoutes || null;
  }

  override async _handleMessage(event: ExtendableMessageEvent): Promise<void> {
    const { data } = event;
    let DATA_CACHE, DOCUMENT_CACHE, ASSET_CACHE;

    DATA_CACHE = this.dataCacheName;
    DOCUMENT_CACHE = this.documentCacheName;
    ASSET_CACHE = this.assetCacheName;

    if (data.type !== 'REMIX_NAVIGATION' || !data.isMount) return;

    this.runPlugins('messageDidReceive', {
      event,
    });

    const cachePromises: Map<string, Promise<void>> = new Map();
    const [dataCache, documentCache, assetCache] = await Promise.all([
      Storage.open(DATA_CACHE),
      Storage.open(DOCUMENT_CACHE),
      Storage.open(ASSET_CACHE),
    ]);

    const manifest: AssetsManifest = data.manifest;
    const routes = Object.values(manifest?.routes || {});

    for (const route of routes) {
      if (route.id.includes('$')) {
        // logger.info('Skipping parametrized route:', route.id);
        continue;
      }

      // Handle ignored routes
      if (Array.isArray(this._ignoredFiles)) {
        // E.g '/dashboard' or 'dashboard'
        if (typeof this._ignoredFiles[0] === 'string') {
          const map = this._ignoredFiles.map(ignoredRoute => {
            ignoredRoute = ignoredRoute as unknown as string;
            ignoredRoute = ignoredRoute.charAt(0) === '/' ? ignoredRoute : (ignoredRoute = '/' + ignoredRoute);

            // The || operator is still unknown imo, is it needed? Idk 🤨.
            // We could add a feature that checks if the last char is a '/' and if it is, ignore all the children. Else, just that route.
            if (getPathname(route) === ignoredRoute /* || route.id.includes(ignoredRoute) */) {
              // logger.debug('Skipping ignored route:', route.id);
              return true;
            } else {
              return false;
            }
          });

          if (map.includes(true)) continue;
        }
        // E.g (route) => route.id.includes('dashboard')
        else if (typeof this._ignoredFiles[0] === 'function') {
          const map = this._ignoredFiles.map(ignoredRoute => {
            ignoredRoute = ignoredRoute as unknown as (route: EntryRoute) => boolean;

            if (ignoredRoute(route)) {
              // logger.debug('Skipping ignored route:', route.id);
              return true;
            } else {
              return false;
            }
          });

          if (map.includes(true)) continue;
        }
        // E.g /dashboard/
        else if (this._ignoredFiles[0] instanceof RegExp) {
          const map = this._ignoredFiles.map(ignoredRoute => {
            ignoredRoute = ignoredRoute as unknown as RegExp;

            if (ignoredRoute.test(getPathname(route))) {
              // logger.debug('Skipping ignored route:', route.id);
              return true;
            } else {
              return false;
            }
          });

          if (map.includes(true)) continue;
        } else {
          logger.error('Invalid ignoredRoutes type:', this._ignoredFiles);
        }
      } else if (typeof this._ignoredFiles === 'function') {
        if (this._ignoredFiles(route)) {
          // logger.debug('Skipping ignored route:', route.id);
          continue;
        }
      }

      // logger.log('Precaching route:', route.id);
      cacheRoute(route);
    }

    await Promise.all(cachePromises.values());

    async function cacheRoute(route: EntryRoute) {
      const pathname = getPathname(route);

      if (route.hasLoader) {
        await cacheLoaderData(route);
      }

      if (route.module) {
        cachePromises.set(route.module, cacheAsset(route.module));
      }

      if (route.imports) {
        for (const assetUrl of route.imports) {
          logger.groupCollapsed('Caching asset: ', assetUrl);

          logger.log('Is index:', route.index || false);
          logger.log('Parent ID:', route.parentId);
          logger.log('Imports:', route.imports);
          logger.log('Module:', route.module);

          logger.groupEnd();

          if (cachePromises.has(assetUrl)) {
            continue;
          }

          cachePromises.set(assetUrl, cacheAsset(assetUrl));
        }
      }

      logger.info('Caching document:', pathname);

      const response = await fetch(pathname);

      cachePromises.set(
        pathname,
        documentCache.put(pathname, response).catch((error: unknown) => {
          if (error instanceof TypeError) {
            logger.error(`TypeError when caching document ${pathname}:`, error.message);
          } else if (error instanceof DOMException) {
            logger.error(`DOMException when caching document ${pathname}:`, error.message);
          } else {
            logger.error(`Failed to cache document ${pathname}:`, error);
          }
        })
      );
    }

    async function cacheLoaderData(route: EntryRoute) {
      const pathname = getPathname(route);
      const params = new URLSearchParams({ _data: route.id });
      const search = `?${params.toString()}`;
      const url = pathname + search;
      if (!cachePromises.has(url)) {
        const data = await fetch(url);

        // logger.debug('caching loader data', url);
        cachePromises.set(
          url,
          dataCache.put(url, data).catch(error => {
            if (error instanceof TypeError) {
              logger.error(`TypeError when caching data ${pathname}:`, error.message);
            } else if (error instanceof DOMException) {
              logger.error(`DOMException when caching data ${pathname}:`, error.message);
            } else {
              logger.error(`Failed to cache data ${pathname}:`, error);
            }
          })
        );
      }
    }

    async function cacheAsset(assetUrl: string) {
      if (await assetCache.match(assetUrl)) {
        return;
      }

      const response = await fetch(assetUrl);

      // logger.debug('Caching asset:', assetUrl);
      return assetCache.put(assetUrl, response).catch(error => {
        if (error instanceof TypeError) {
          logger.error(`TypeError when caching asset ${assetUrl}:`, error.message);
        } else if (error instanceof DOMException) {
          logger.error(`DOMException when caching asset ${assetUrl}:`, error.message);
        } else {
          logger.error(`Failed to cache asset ${assetUrl}:`, error);
        }
      });
    }

    function getPathname(route: EntryRoute) {
      if (route.index && route.parentId === 'root') return '/';

      let pathname = '';

      if (route.path && route.path.length > 0) {
        pathname = '/' + route.path;
      }

      if (route.parentId) {
        const parentPath = getPathname(manifest.routes[route.parentId]);
        if (parentPath) {
          pathname = parentPath + pathname;
        }
      }

      return pathname;
    }
  }
}
