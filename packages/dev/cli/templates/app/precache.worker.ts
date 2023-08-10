/// <reference lib="WebWorker" />

export type {};
declare let self: ServiceWorkerGlobalScope;

// Precache Worker

self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('Service worker installed');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('Service worker activated');
  event.waitUntil(self.clients.claim());
});
