/// <reference lib="WebWorker" />

import { EnhancedCache, logger, clearUpOldCaches, NavigationHandler } from '@remix-pwa/sw';
import { registerQueue } from '@remix-pwa/sync';
import createStorageRepository from './database';

declare let self: ServiceWorkerGlobalScope;

const CURRENT_CACHE_VERSION = 'v2';

const assetCache = new EnhancedCache('remix-assets', {
  version: CURRENT_CACHE_VERSION,
  strategy: 'CacheFirst',
  strategyOptions: {
    maxEntries: 2,
    maxAgeSeconds: 60,
    cacheableResponse: false,
  }
})

registerQueue('offline-action');

/**
 * The load context works same as in Remix. The return values of this function will be injected in the worker action/loader.
 * @param {FetchEvent} [event] The fetch event request.
 * @returns {object} the context object.
 */
export const getLoadContext = () => {
  const stores = createStorageRepository();

  return {
    database: stores,
  };
};

self.addEventListener('install', (event: ExtendableEvent) => {
  logger.log('installing service worker');
  logger.warn('This is a playground service worker 📦. It is not intended for production use.');
  event.waitUntil(
    Promise.all([
      self.skipWaiting(),
      assetCache.preCacheUrls(['/entry.worker.css'])
      // assetCache.preCacheUrls(self.__workerManifest.assets) // - Ideal, lol. We wish!
    ])
  );
});

self.addEventListener('activate', event => {
  logger.log(self.clients, 'manifest:\n', self.__workerManifest);
  event.waitUntil(
    Promise.all([
      clearUpOldCaches(['remix-assets'], CURRENT_CACHE_VERSION),
    ]).then(() => {
      self.clients.claim();
    })
  );
});

new NavigationHandler({
  documentCache: new EnhancedCache('remix-document', {
    version: CURRENT_CACHE_VERSION,
    strategy: 'CacheFirst',
    strategyOptions: {
      maxEntries: 10,
      maxAgeSeconds: 60,
      cacheableResponse: {
        statuses: [200],
      },
    },
  }),
})
