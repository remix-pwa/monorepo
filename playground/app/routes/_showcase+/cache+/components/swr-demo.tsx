import { StaleWhileRevalidate } from "@remix-pwa/sw"
import { useState, useCallback, useEffect } from "react"
import { Button, IframeWrapper, MockPage } from "~/components"
import { usePromise } from "~/hooks/usePromise"
import { useRefresh } from "~/hooks/useRefresh"
import { createMockFetchWrapper } from "~/utils"

export const StaleWhileRevalidateDemo = () => {
  const { refreshCounter, refresh } = useRefresh()
  const { promise, reset, set } = usePromise<string>()
  const [config, setConfig] = useState({ isOffline: false, cacheHit: false })

  const SERVER_DATA = 'Raw data from server.\nCurrent time is: ' + new Date().toLocaleTimeString()
  const URL = '/api/stale-while-revalidate';

  const DEMO_CODE = `
import { StaleWhileRevalidate } from "@remix-pwa/sw"

const cache = new StaleWhileRevalidate('cache-name');

const response = await cache.handleRequest(request);

// cache can also be manually updated
cache.updateCache(request, response);

// cache hit detection
response.headers.get('x-cache-hit') === 'true'; // true if cache
`

  const fetchData = useCallback(async () => {
    const cache = new StaleWhileRevalidate('cache-text-demo');

    const response = await cache.handleRequest(URL);
    const wasCacheHit = response.headers.get('x-cache-hit') === 'true';
    const text = await response.text();
    const data = wasCacheHit
      ? text
      : text.replace(/Current time is: .+/, `Current time is: ${new Date().toLocaleTimeString()}`);

    setConfig(c => ({ ...c, cacheHit: wasCacheHit }));
    set((wasCacheHit ? data.replace('Current', 'Cached').replace('Raw data from server', 'Cached content') : data) + '\nActual time is: ' + new Date().toLocaleTimeString());
  }, []);

  const fetchLoader = async () => {
    if (config.isOffline) {
      throw new Error('Failed to fetch')
    }

    await new Promise(res => setTimeout(res, 800)) /* Server stuffs */

    return new Response(SERVER_DATA, { status: 200 })
  }

  useEffect(() => {
    const fetchDataWithMockedFetch = createMockFetchWrapper(URL, fetchLoader)(fetchData);
    fetchDataWithMockedFetch();
  }, [refreshCounter, fetchData])

  const clearCache = () => {
    caches.open('cache-text-demo').then(cache => cache.delete(URL));
  }

  return (
    <IframeWrapper
      title="Stale While Revalidate"
      code={{
        content: DEMO_CODE,
        lang: 'ts'
      }}
      handleRefresh={() =>
        refresh(() => reset())
      }
    >
      <div className="px-4 py-2.5 overflow-hidden" key={refreshCounter}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Stale While Revalidate Strategy</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          This serves cached content immediately while fetching updates in the background. It's perfect for balancing speed and freshness.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button
            variant="outline"
            className="bg-transparent hover:bg-red-50 text-red-600 border-2 outline-none border-red-500 dark:text-red-400 dark:hover:bg-red-900/25 focus:ring-red-500 md:text-sm"
            onClick={() => setConfig(c => ({ ...c, isOffline: !c.isOffline }))}
          >
            {config.isOffline ? 'Come Online' : 'Go Offline'}
          </Button>
          <Button
            onClick={clearCache}
            variant="solid"
            color="secondary"
            className="md:text-sm"
          // className="bg-neon hover:bg-yellow-600 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300 ease-in-out"
          >
            Clear Cache
          </Button>
        </div>
        <MockPage promise={promise} />
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">Network Status: <span className="font-semibold text-gray-700 dark:text-gray-300">{config.isOffline ? 'Offline' : 'Online'}</span></p>
          <p className="mb-0">Was Cache Hit: <span className="font-semibold text-gray-700 dark:text-gray-300">{config.cacheHit ? 'Yes' : 'No'}</span></p>
        </div>
      </div>
    </IframeWrapper>
  )
}