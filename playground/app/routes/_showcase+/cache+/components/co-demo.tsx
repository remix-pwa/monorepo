import { CacheOnly } from "@remix-pwa/sw"
import { useState, useCallback, useEffect } from "react"
import { Button, MockPage, ToggleBar, IframeWrapper } from "~/components"
import { usePromise } from "~/hooks/usePromise"
import { useRefresh } from "~/hooks/useRefresh"
import { createMockFetchWrapper } from "~/utils"

export const CacheOnlyDemo = () => {
  const { refreshCounter, refresh } = useRefresh()
  const { promise, reset, set } = usePromise<string>()
  const [config, setConfig] = useState({ isOffline: false, expiration: 30 })
  const [dataToCache, setDataToCache] = useState('')

  const URL = '/api/cache-only';

  const fetchData = useCallback(async () => {
    const cache = new CacheOnly('cache-text-demo', { maxAgeSeconds: config.expiration });

    try {
      const response = await cache.handleRequest(URL);
      const text = await response.text();
      set(text);
    } catch (e) {
      set('Error! No response found in cache.\nMake sure to always have a fallback, else things get ugly pretty fast 💥');
    }
  }, []);

  // This useEffect mocks our worker thread :)
  useEffect(() => {
    // We use an empty loader here cause cache only never reaches
    // the server.
    const fetchDataWithMockedFetch = createMockFetchWrapper(URL, async () => new Response())(fetchData);
    fetchDataWithMockedFetch();
  }, [refreshCounter, fetchData])

  const clearCache = () => {
    caches.open('cache-text-demo').then(cache => cache.delete(URL));
  }

  const putInCache = () => {
    const cache = new CacheOnly('cache-text-demo', { maxAgeSeconds: config.expiration });
    dataToCache.length && cache.addToCache(new Request(URL), new Response(dataToCache));
  }

  return (
    <IframeWrapper
      title="Cache Only"
      handleRefresh={() =>
        refresh(() => reset())
      }
    >
      <div className="px-4 py-2.5 overflow-hidden" key={refreshCounter}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Cache Only Strategy</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          This strategy checks the cache first and only goes to the network if it can't find what it needs locally.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button
            variant="outline"
            className="bg-transparent md:text-sm hover:bg-red-50 text-red-600 border-2 outline-none border-red-500 dark:text-red-400 dark:hover:bg-red-900/25 focus:ring-red-500"
            onClick={() => setConfig(c => ({ ...c, isOffline: !c.isOffline }))}
          >
            {config.isOffline ? 'Come Online' : 'Go Offline'}
          </Button>
          <Button
            onClick={clearCache}
            variant="solid"
            color="yellow"
            className="md:text-sm"
          // className="bg-neon hover:bg-yellow-600 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300 ease-in-out"
          >
            Clear Cache
          </Button>
        </div>
        <div className="flex gap-3 mb-6">
          {/* Input for putting in cache */}
          <input
            type="text"
            value={dataToCache}
            onChange={e => setDataToCache(e.target.value)}
            placeholder="Enter data to cache"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-dark dark:text-white"
          />
          <button
            onClick={putInCache}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-lg transition duration-300 ease-in-out"
          >
            Cache
          </button>
        </div>
        <MockPage promise={promise} />
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">Network Status: <span className="font-semibold">{config.isOffline ? 'Offline' : 'Online'}</span></p>
          <div className="mb-2 flex items-center gap-2">
            <span className="whitespace-nowrap max-w-min">Current Cache Expiration:</span>
            <ToggleBar
              items={[20, 30, 60, 120]}
              value={config.expiration}
              renderItem={(item) => `${item}s`}
              onChange={(time) => setConfig(c => ({ ...c, expiration: time as number }))}
              color="green"
            />
          </div>
        </div>
      </div>
    </IframeWrapper>
  )
}