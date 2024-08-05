/// <reference lib="WebWorker" />

import { Logger } from '@remix-pwa/sw';

const logger = new Logger({
  prefix: 'showcase'
});

declare let self: ServiceWorkerGlobalScope & { logger: Logger };
self.logger = logger

self.addEventListener('install', (event: ExtendableEvent) => {
  logger.log('installing service worker');
  logger.warn('This is a playground service worker 📦. It is not intended for production use.');
  event.waitUntil(self.skipWaiting());
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