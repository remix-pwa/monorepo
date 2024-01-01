/// <reference lib="WebWorker" />

import type { DefaultFetchHandler } from '@remix-pwa/sw';
import { logger, matchRequest } from '@remix-pwa/sw';
import { registerQueue } from '@remix-pwa/sync';
import createStorageRepository from './database';

declare let self: ServiceWorkerGlobalScope;

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

  // logger.log(request.destination, type, request.url, request.method);
  // const r = fetch('/').then(w => w.text()).then(console.log);
  console.log('Hmm', request.mode);

  return context.fetchFromServer();
};

self.addEventListener('install', (event: ExtendableEvent) => {
  logger.log('installing service worker');
  logger.warn('This is a playground service worker 📦. It is not intended for production use.');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  logger.log(self.clients, 'manifest:\n', self.__workerManifest);
  event.waitUntil(self.clients.claim());
});
