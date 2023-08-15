/// <reference lib="WebWorker" />

// Precache Worker

self.addEventListener('install', event => {
  console.log('Service worker installed');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  console.log('Service worker activated');
  event.waitUntil(self.clients.claim());
});
