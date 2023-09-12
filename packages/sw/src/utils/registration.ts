import { logger } from '../private/logger.js';

/**
 * Unregister current active service worker (if found).
 */
export async function unregisterServiceWorker() {
  const registration = await navigator.serviceWorker.getRegistration();
  await registration?.unregister();
  logger.log('Service worker unregistered successfully.');
}

// Awaiting for Sarabadu PR --- https://github.com/remix-pwa/sw/pull/25
