import { logger } from '../logger/logger.js';

/**
 * Unregister current active service worker (if found).
 */
export async function unregisterServiceWorker() {
  const registration = await navigator.serviceWorker.getRegistration();
  await registration?.unregister();
  if (process.env.NODE_ENV === 'development') logger.log('Service worker unregistered successfully.');
}
