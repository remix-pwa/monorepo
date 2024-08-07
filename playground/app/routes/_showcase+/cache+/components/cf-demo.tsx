import { CacheFirst } from "@remix-pwa/sw"
import { useState, useCallback, useEffect } from "react"
import { IframeWrapper, Button, MockPage, ToggleBar } from "~/components"
import { usePromise } from "~/hooks/usePromise"
import { useRefresh } from "~/hooks/useRefresh"
import { createMockFetchWrapper } from "~/utils"

export const CacheFirstDemo = () => {
  const { refreshCounter, refresh } = useRefresh()
  const { promise, reset, set } = usePromise<string>()
  const [config, setConfig] = useState({ isOffline: false, expiration: 30, cacheHit: false })

  // This mocks the server response for this demo
  const SERVER_DATA = 'Raw data from server.\nCurrent time is: ' + new Date().toLocaleTimeString()
  // Endpoint mock
  const URL = '/api/cache-first';
  const DEMO_CODE = `
import { CacheFirst } from '@remix-pwa/sw';

const cache = new CacheFirst('cache-name', {/* options */});

// within your browser/worker thread
try {
  response: Promise<Response> = await cache.handleRequest(request)
} catch (error) {
  /* handle anomalies here */
}

// detect cache hit (was this from the server or cache?)
response.headers.get('x-cache-hit') === 'true' // true if cache

// utilise the response as needed
const text = await response.text();
console.log(text);
`

  // Simulates fetching data from a server with configurable behavior.
  //
  // For some reason, explicitly fetching loader (via the `_data`) param
  // is forbidden (403). And I did not want to create separate endpoints for
  // *every* single demo.
  const fetchFromLoader = async () => {
    await new Promise(res => setTimeout(res, 750)) /* Server stuffs */

    if (config.isOffline) {
      throw new Error('Failed to fetch')
    }

    return new Response(SERVER_DATA)
  }

  /**
   * Fetches data using a cache-first strategy with mocked fetch.
   */
  const fetchData = useCallback(async () => {
    const cache = new CacheFirst('cache-text-demo', { maxAgeSeconds: config.expiration });

    const response = await cache.handleRequest(URL);
    const text = await response.text();
    const wasCacheHit = response.headers.get('x-cache-hit') === 'true';

    const data = wasCacheHit
      ? text
      : text.replace(/Current time is: .+/, `Current time is: ${new Date().toLocaleTimeString()}`);

    setConfig(c => ({ ...c, cacheHit: wasCacheHit }));
    set((wasCacheHit ? data.replace('Current', 'Cached').replace('Raw data from server', 'Cached content') : data) + '\nActual time is: ' + new Date().toLocaleTimeString());
  }, []);

  // This useEffect mocks our worker thread :)
  useEffect(() => {
    // Create a wrapped version of fetchData that uses mocked fetch for the specified URL.
    //
    // Instead of hitting a non-existent endpoint, mock the fetch
    // on the client.
    const fetchDataWithMockedFetch = createMockFetchWrapper(URL, fetchFromLoader)(fetchData);

    fetchDataWithMockedFetch();
  }, [refreshCounter, fetchData])

  const clearCache = () => {
    caches.open('cache-text-demo').then(cache => cache.delete(URL));
  }

  return (
    <IframeWrapper
      handleRefresh={() =>
        refresh(() => reset())
      }
      code={{
        content: DEMO_CODE,
        lang: 'ts'
      }}
      title="Cache First"
    >
      <div className="px-4 py-2.5" key={refreshCounter}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Cache First Strategy</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          This strategy checks the cache first and only goes to the network if it can't find what it needs locally.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button
            variant="outline"
            className="bg-transparent hover:bg-red-50 text-red-600 border-2 outline-none border-red-500 dark:text-red-400 dark:hover:bg-red-900/25 focus:ring-red-500"
            onClick={() => setConfig(c => ({ ...c, isOffline: !c.isOffline }))}
          >
            {config.isOffline ? 'Come Online' : 'Go Offline'}
          </Button>
          <Button
            onClick={clearCache}
            variant="solid"
            color="yellow"
            className="md:text-sm"
          >
            Clear Cache
          </Button>
        </div>
        <MockPage promise={promise} />
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">Network Status: <span className="font-semibold text-gray-700 dark:text-gray-300">{config.isOffline ? 'Offline' : 'Online'}</span></p>
          <p className="mb-2">Cache Hit: <span className="font-semibold text-gray-700 dark:text-gray-300">{config.cacheHit ? 'Yes' : 'No'}</span></p>
          <div className="flex items-center gap-2">
          <span className="whitespace-nowrap max-w-min">Cache Expiration:</span>
            <ToggleBar
              items={[30, 60, 120]}
              value={config.expiration}
              renderItem={(item) => `${item}s`}
              onChange={(time) => setConfig(c => ({ ...c, expiration: time as number }))}
              color="primary"
            />
          </div>
        </div>
      </div>
    </IframeWrapper>
  )
}
