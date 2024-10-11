/// <reference lib="WebWorker" />

import { EnhancedCache, isDocumentRequest, isLoaderRequest, logger, NavigationHandler } from '@remix-pwa/sw';
import { PushManager } from '@remix-pwa/push/client';

declare let self: ServiceWorkerGlobalScope;

console.log('Hello from service worker!');
// @ts-ignore
console.log(process.env.NODE_ENV, process.env.API_URL, miscellaneous);

const documentCache = new EnhancedCache('document-cache', {
  version: 'v1',
  strategy: 'NetworkFirst',
  strategyOptions: {}
})

const assetCache = new EnhancedCache('asset-cache', {
  version: 'v1',
  strategy: 'CacheFirst',
  strategyOptions: {}
})

const dataCache = new EnhancedCache('data-cache', {
  version: 'v1',
  strategy: 'NetworkFirst',
  strategyOptions: {}
})

/**
 * The load context works same as in Remix. The return values of this function will be injected in the worker action/loader.
 * @param {FetchEvent} [event] The fetch event request.
 * @returns {object} the context object.
 */
export const getLoadContext = () => {
  // const stores = createStorageRepository();

  return {
    database: [],
    stores: [],
    caches: [documentCache, dataCache],
  };
};

const isAssetRequest = (request: Request)=> {
  const url = new URL(request.url);

  const hasNoParams = url.search === '';

  return self.__workerManifest.assets.includes(url.pathname) && hasNoParams;
}

export const defaultFetchHandler = async ({ request, context }: any) => {
  const req = context.event.request;
  // const url = new URL(req.url)
  // console.log(req)

  // The referrer (the URL of the page that made the request)
  const referrer = req.referrer; // This is usually the full URL of the document

  // You can also check the 'Referer' header (note the different spelling)
  const refererHeader = req.headers.get('X-Route-Id');

  // if ((req as Request).destination === 'image') {
  //   console.log('Image request', req);
  //   console.log(self.__workerManifest, 'manifest')
  // }


  // console.log('Referrer (page making the request):', refererHeader, req.url);

  if (isAssetRequest(request)) {
    return assetCache.handleRequest(request);
  }

  if (isDocumentRequest(request)) {
    return documentCache.handleRequest(request);
  }

  const url = new URL(context.event.request.url);
  // url.searchParams.get('_route') && console.log(url.searchParams.get('_route'), '_route', req.url)

  // If it is loader request, and there's no worker route API for it,
  // we have to run it ourselves
  if (isLoaderRequest(request) && self.__workerManifest.routes[url.searchParams.get('_data') ?? ''].hasLoader) {
    return dataCache.handleRequest(request);
  }

  // logger.log('default handler');
  return context.fetchFromServer();
}

self.addEventListener('install', (event: ExtendableEvent) => {
  logger.log('installing service worker');
  logger.warn('This is a playground service worker 📦. It is not intended for production use.');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

const msgHandler = new NavigationHandler({
  cache: documentCache,
})

self.addEventListener('message', async event => {
  await msgHandler.handleMessage(event);
})

new PushManager()