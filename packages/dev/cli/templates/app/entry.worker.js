/// <reference lib="WebWorker" />

import { Storage } from '@remix-pwa/cache';
import { cacheFirst, networkFirst } from '@remix-pwa/strategy';
import { RemixNavigationHandler, logger, matchRequest } from '@remix-pwa/sw';

let self;

const PAGES = 'page-cache';
const DATA = 'data-cache';
const ASSETS = 'assets-cache';

// Open the caches and wrap them in `RemixCache` instances.
const dataCache = Storage.open(DATA, {
  ttl: 60 * 60 * 24 * 7 * 1_000, // 7 days
});
const documentCache = Storage.open(PAGES);
const assetCache = Storage.open(ASSETS);

self.addEventListener('install', event => {
  logger.log('Service worker installed');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  logger.log('Service worker activated');
  event.waitUntil(self.clients.claim());
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

// The default fetch event handler will be invoke if the
// route is not matched by any of the worker action/loader.
export const defaultFetchHandler = ({ context, request }) => {
  const type = matchRequest(request);

  if (type === 'asset') {
    return assetsHandler(context.event.request);
  }

  if (type === 'loader') {
    return dataHandler(context.event.request);
  }

  return context.fetchFromServer();
};

const handler = new RemixNavigationHandler({
  dataCache,
  documentCache,
});

self.addEventListener('message', event => {
  event.waitUntil(handler.handle(event));
});
