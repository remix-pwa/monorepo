import { NetworkFirst } from "@remix-pwa/sw"
import { Await } from "@remix-run/react"
import { useState, startTransition, useCallback, useEffect, Suspense } from "react"
import { Iframe, Button, ButtonGroup } from "~/components"
import { usePromise } from "~/hooks/usePromise"
import { useRefresh } from "~/hooks/useRefresh"
import { createMockFetchWrapper, cn } from "~/utils"
import { ToggleBar } from '../../../../components/ui/ToggleBar';

export const NetworkFirstDemo = () => {
  const { refreshCounter, refresh } = useRefresh()
  const { promise, reset, set } = usePromise<string>()
  const [config, setConfig] = useState({
    isOffline: false,
    networkTimeout: 2,
    throttleNetwork: '3g' as '2g' | '3g' | '4g'
  })

  const setData = (result: any) => {
    if (typeof startTransition === 'function') {
      startTransition(() => {
        set(result);
      });
    } else {
      set(result);
    }
  }

  const SERVER_DATA = 'Raw data from server.\nCurrent time is: ';
  const URL = '/api/network-first';

  const fetchData = useCallback(async () => {
    const cache = new NetworkFirst('cache-text-demo', {
      networkTimeoutInSeconds: config.networkTimeout
    });

    try {
      const response = await cache.handleRequest(URL);
      const text = (await response.text()) + new Date().toLocaleTimeString();
      const wasCacheHit = response.headers.get('x-cache-hit') === 'true';
      setData((wasCacheHit ? text.replace('Current', 'Cached').replace('Raw data from server', 'Cached content') : text) + '\nActual time is: ' + new Date().toLocaleTimeString());
    } catch (e) {
      setData('Error! Network timeout and no response found in cache either.');
    }
  }, []);

  const fetchLoader = async () => {
    const timeout = config.throttleNetwork === '2g' ? 3_150 : config.throttleNetwork === '3g' ? 1_900 : 700;

    if (config.isOffline) {
      throw new Error('Failed to fetch')
    }

    await new Promise(res => setTimeout(res, timeout)) /* Server stuffs */

    return new Response(SERVER_DATA)
  }

  useEffect(() => {
    const fetchDataWithMockedFetch = createMockFetchWrapper(URL, fetchLoader)(fetchData);
    fetchDataWithMockedFetch();
  }, [refreshCounter, fetchData])

  const clearCache = () => {
    caches.open('cache-text-demo').then(cache => cache.delete(URL));
  }

  return (
    <Iframe
      title="Network First"
      handleRefresh={() =>
        refresh(() => reset())
      }
    >
      <div className="px-4 py-2.5 overflow-hidden" key={refreshCounter}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Network First Strategy</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          This strategy tries to fetch fresh data from the network first, falling back to the cache if the network is unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 gap-y-2.5 mb-6 md:text-sm font-semibold">
          <Button
            variant="outline"
            color="red"
            className="dark:hover:bg-red-900/25 md:text-sm"
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
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 mb-6">
          <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
            <Suspense fallback={<div>Page Loading...</div>}>
              <Await resolve={promise}>
                {(resolvedData) => <code>{resolvedData}</code>}
              </Await>
            </Suspense>
          </pre>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">Network Status: <span className="font-semibold text-gray-700 dark:text-gray-300">{config.isOffline ? 'Offline' : 'Online'}</span></p>
          <div className="mb-2 flex items-center gap-2">
            <span className="whitespace-nowrap max-w-min">Current Network Timeout:</span>
            <ToggleBar
              items={[2, 3]}
              value={config.networkTimeout}
              onChange={(timeout) => setConfig(c => ({ ...c, networkTimeout: timeout as number }))}
              renderItem={(item) => `${item}s`}
              color="primary"
            />
          </div>
          <div className="mb-2 flex items-center gap-2">
            <span className="whitespace-nowrap max-w-min">Current Network Speed:</span>
            <ToggleBar
              items={['2g', '3g', '4g']}
              value={config.throttleNetwork}
              onChange={(speed) => setConfig(c => ({ ...c, throttleNetwork: speed as '2g' | '3g' | '4g' }))}
              color="purple"
            />
          </div>
        </div>
      </div>
    </Iframe>
  )
}
