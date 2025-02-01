/// <reference lib="WebWorker" />

import { logger } from '@remix-pwa/sw';

declare let self: ServiceWorkerGlobalScope;

console.log('Hello from service worker!');
// @ts-ignore
console.log(process.env.NODE_ENV, process.env.API_URL, miscellaneous);

self.addEventListener('install', (event: ExtendableEvent) => {
  logger.log('installing service worker');
  logger.warn('This is a playground service worker 📦. It is not intended for production use.');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
