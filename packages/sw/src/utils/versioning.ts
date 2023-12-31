export const clearUpOldCaches = (cacheNames: string[]) => {
  return caches.keys().then(allCacheNames => {
    const deletionPromises: Promise<boolean>[] = [];

    cacheNames.forEach(cacheName => {
      const { cacheActualName } = getCacheNameAndVersion(cacheName);

      const cachesToDelete = allCacheNames.filter(cache => cache.startsWith(cacheActualName) && cache !== cacheName);

      cachesToDelete.forEach(oldCacheName => {
        const deletePromise = caches.delete(oldCacheName);
        deletionPromises.push(deletePromise);
      });
    });

    return Promise.all(deletionPromises);
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
