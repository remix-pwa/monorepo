/// <reference lib="WebWorker" />

import { RemixNavigationHandler } from '@remix-pwa/sw';
import createStorageRepository from './database';
import { registerQueue } from '@remix-pwa/sync';

declare let self: ServiceWorkerGlobalScope;

const PAGES = 'page-cache';
const DATA = 'data-cache';
// const ASSETS = 'assets-cache';

let handler = new RemixNavigationHandler({
  dataCacheName: DATA,
  documentCacheName: PAGES,
});

// const documentHandler = new NetworkFirst({ 
//   cacheName: PAGES,
// });

// const loadersHandler = new NetworkFirst({
//   cacheName: DATA,
// });

// const assetsHandler = new CacheFirst({
//   cacheName: ASSETS,
// });

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

// The default fetch event handler will be invoke if the route is not matched by any of the worker action/loader.
export const defaultFetchHandler = ({ context, request }: any) => {
  // const type = matchRequest(request);

  // if (type === 'asset') {
  //   return assetsHandler.handle(request);
  // }

  // if (type === 'loader') {
  //   return loadersHandler.handle(request);
  // }

  // if (type === 'document') {
  //   return documentHandler.handle(request);
  // }

  return context.fetchFromServer();
};

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', event => {
  event.waitUntil(handler.handle(event));
});
