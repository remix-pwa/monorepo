/// <reference lib="WebWorker" />

import { Storage } from '@remix-pwa/cache';
import { cacheFirst, networkFirst } from '@remix-pwa/strategy';
import type { DefaultFetchHandler } from '@remix-pwa/sw';
import { RemixNavigationHandler, logger, matchRequest } from '@remix-pwa/sw';
import { registerQueue } from '@remix-pwa/sync';
import createStorageRepository from './database';

declare let self: ServiceWorkerGlobalScope;

const PAGES = 'page-cache';
const DATA = 'data-cache';
const ASSETS = 'assets-cache';

const dataCache = Storage.open(DATA, {
  ttl: 60 * 60 * 24 * 7 * 1_000, // 7 days
});
const documentCache = Storage.open(PAGES);
const assetCache = Storage.open(ASSETS);

let handler = new RemixNavigationHandler({
  dataCache: dataCache,
  documentCache: documentCache,
});

const dataHandler = networkFirst({
  cache: dataCache,
});

const assetsHandler = cacheFirst({
  cache: assetCache,
  cacheQueryOptions: {
    ignoreSearch: true,
    ignoreVary: true,
  },
});

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

// The default fetch event handler will be invoke if the
// route is not matched by any of the worker action/loader.
export const defaultFetchHandler: DefaultFetchHandler = ({ context, request }) => {
  const type = matchRequest(request);

  if (type === 'asset') {
    return assetsHandler(context.event.request);
  }

  if (type === 'loader') {
    return dataHandler(context.event.request);
  }

  return context.fetchFromServer();
};

self.addEventListener('install', (event: ExtendableEvent) => {
  logger.log('installing service worker');
  logger.warn('This is a playground service worker 📦. It is not intended for production use.');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  logger.log(self.clients)
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', event => {
  event.waitUntil(handler.handle(event));
});

