/// <reference lib="WebWorker" />

import { DefaultFetchHandler, EnhancedCache, Logger } from '@remix-pwa/sw';

const logger = new Logger({
  prefix: 'showcase',
});

declare let self: ServiceWorkerGlobalScope & { logger: Logger };
self.logger = logger;

const imageCache = new EnhancedCache('image-cache', {
  strategy: 'CacheFirst',
  strategyOptions: {
    matchOptions: {
      ignoreSearch: false,
    },
    maxAgeSeconds: 60 * 60 * 24 * 365,
  },
  version: 'v1',
});

self.addEventListener('install', (event: ExtendableEvent) => {
  logger.log('installing service worker');
  logger.warn('This is a playground service worker 📦. It is not intended for production use.');

  event.waitUntil(
    Promise.all([
      imageCache.preCacheUrls(self.__workerManifest.assets.filter(url => url.includes('/images/'))),
      self.skipWaiting(),
    ])
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

/**
 * The load context works same as in Remix. The return values of this function will be injected in the worker action/loader.
 * @param {FetchEvent} [event] The fetch event request.
 * @returns {object} the context object.
 */
export const getLoadContext = () => {
  return {
    logger: self.logger,
  };
};

export const defaultFetchHandler: DefaultFetchHandler = async ({ context }) => {
  const { event, fetchFromServer } = context;

  const req = event.request;
  const url = new URL(req.url);

  if (req.destination === 'image' && url.pathname.includes('/images/')) {
    return imageCache.handleRequest(event.request);
  }

  return fetchFromServer()
}