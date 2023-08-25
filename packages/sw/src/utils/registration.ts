/**
 * Unregister current active service worker (if found).
 */
export async function unregisterServiceWorker() {
  const registration = await navigator.serviceWorker.getRegistration();
  await registration?.unregister();
}

// Awaiting for Sarabadu PR --- https://github.com/remix-pwa/sw/pull/25
