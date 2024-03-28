/// <reference lib="WebWorker" />

import { EnhancedCache, logger, NavigationHandler } from '@remix-pwa/sw';

declare let self: ServiceWorkerGlobalScope;

const documentCache = new EnhancedCache('document-cache', {
  version: 'v1',
  strategy: 'NetworkFirst',
  strategyOptions: {}
})

/**
 * The load context works same as in Remix. The return values of this function will be injected in the worker action/loader.
 * @param {FetchEvent} [event] The fetch event request.
 * @returns {object} the context object.
 */
export const getLoadContext = () => {
  // const stores = createStorageRepository();

  return {
    database: [],
    stores: [],
    caches: [documentCache],
  };
};

export const defaultFetchHandler = async ({ context }: any) => {
  // logger.log('default handler');
  return context.fetchFromServer();
}

self.addEventListener('install', (event: ExtendableEvent) => {
  logger.log('installing service worker');
  logger.warn('This is a playground service worker 📦. It is not intended for production use.');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});



const msgHandler = new NavigationHandler({
  cache: documentCache,
})

self.addEventListener('message', async event => {
  await msgHandler.handleMessage(event);
})