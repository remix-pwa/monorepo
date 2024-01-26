/**
 * @param cacheNames - Array of cache names to clear up (auto-version).
 * @param version - Optional version to append to the cache names. Used to determine cache versios and clean up mismatched versions.
 * @returns {Promise<void>} - Promise that resolves when all caches are cleared.
 */
export const clearUpOldCaches = (cacheNames: string[], version?: string) => {
  if (version) {
    cacheNames = cacheNames.map(cacheName => `${cacheName}-${version}`);
  }
  return caches.keys().then(allCacheNames => {
    return Promise.all([
      cacheNames.forEach(cacheName => {
        const { cacheActualName } = getCacheNameAndVersion(cacheName);
        const cachesToDelete = allCacheNames.filter(cache => cache.startsWith(cacheActualName) && cache !== cacheName);
        // console.log(cachesToDelete, allCacheNames);
        cachesToDelete.forEach(oldCacheName => {
          caches.delete(oldCacheName);
        });
      }),
    ]);
  });
};
/**
 * Helper function to extract actual cache name and version.
 * Assumes the cache name is of the format 'cacheName-version'.
 */
const getCacheNameAndVersion = (cacheName: string) => {
  const splittedName = cacheName.split('-');
  const version = splittedName.pop();
  const versionIndex = splittedName.length - 1;
  const cacheActualName = splittedName.slice(0, versionIndex).join('-');

  return { cacheActualName, version };
};
