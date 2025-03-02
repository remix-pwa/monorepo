import * as entrySW from 'virtual:entry-sw';
import { isLoaderRequest, isActionRequest, json } from '@remix-pwa/sw';

const defaultHandler =
  (entrySW.entry.module.defaultFetchHandler) ||
  (event => fetch(event.request.clone()));

function createContext(event) {
  const context = entrySW.entry.module.getLoadContext?.(event) || {};
  return {
    event,
    fetchFromServer: () => fetch(event.request.clone()),
    ...context,
  };
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const routeDataParam = url.searchParams.get('_data');

  const route = routeDataParam
    ? entrySW.routes[routeDataParam]
    : undefined

  const args = {
    request: event.request,
    params: '',
    context: createContext(event),
  }

  try {
    if (isLoaderRequest(event.request) && route?.module.workerLoader) {
      const response = route.module.workerLoader(args);
      event.respondWith(response.then(res => isResponse(res) ? res : json(res)));
      return;
    }

    if (isActionRequest(event.request) && route?.module.workerAction) {
      const response = route.module.workerAction(args);
      console.log('action response', isResponse(response));
      event.respondWith(response.then(res => isResponse(res) ? res : json(res)));
      return;
    }
  } catch (error) {
    console.error(`An error occurred: ${error}`);
  }

  console.log('defaultHandler', route);

  event.respondWith(defaultHandler(args));
});

function isResponse(value) {
  return value != null && typeof value.status === "number" && typeof value.statusText === "string" && typeof value.headers === "object" && typeof value.body !== "undefined";
}