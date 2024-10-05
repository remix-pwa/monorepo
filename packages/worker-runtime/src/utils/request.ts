import type { WorkerLoadContext } from '@remix-pwa/dev/worker-build.js';
import { matchPath } from '@remix-run/router';

/**
 * Clones an object
 */
export function clone<T extends Record<string | number | symbol, unknown> | Request>(_object: T): T {
  const init: T = {} as T;
  for (const property in _object) {
    init[property] = _object[property];
  }
  return init;
}

/**
 * Gets the URL search parameters from a request.
 */
export function getURLParameters(request: Request, path = ''): Record<string, string | undefined> {
  const url = new URL(request.url);
  const match = matchPath(path, url.pathname);

  return {
    ...Object.fromEntries(new URL(request.url).searchParams.entries()),
    ...match?.params,
  };
}

/**
 * Removes the all the index parameters from a request unless they are not empty.
 */
export function stripIndexParameter(request: Request): Request {
  const url = new URL(request.url);
  const indexValues = url.searchParams.getAll('index');
  const indexValuesToKeep: Array<string> = [];

  url.searchParams.delete('index');

  for (const indexValue of indexValues) {
    if (indexValue) {
      indexValuesToKeep.push(indexValue);
    }
  }
  for (const toKeep of indexValuesToKeep) {
    url.searchParams.append('index', toKeep);
  }
  // We need to set the duplex property, otherwise the request will fail in the worker.
  // @ts-expect-error The duplex property is not defined in the Request type, yet. See: https://github.com/whatwg/fetch/pull/1493
  return new Request(url.href, { ...clone(request), duplex: 'half' });
}

/**
 * Removes the data parameter from a request.
 */
export function stripDataParameter(request: Request): Request {
  const url = new URL(request.url);
  url.searchParams.delete('_data');
  // We need to set the duplex property, otherwise the request will fail in the worker.
  // @ts-expect-error The duplex property is not defined in the Request type, yet. See: https://github.com/whatwg/fetch/pull/1493
  return new Request(url.href, { ...clone(request), duplex: 'half' });
}

/**
 * Removes the route parameter from a request.
 */
export function stripRouteParameter(request: Request): Request {
  const url = new URL(request.url);
  url.searchParams.delete('_route');
  // We need to set the duplex property, otherwise the request will fail in the worker.
  // @ts-expect-error The duplex property is not defined in the Request type, yet. See: https://github.com/whatwg/fetch/pull/1493
  return new Request(url.href, { ...clone(request), duplex: 'half' });
}

/**
 * Creates arguments for the Worker Actions and Loaders.
 */
export function createArgumentsFrom({
  event,
  loadContext,
  path,
}: {
  event: FetchEvent;
  loadContext: WorkerLoadContext;
  path?: string;
}) {
  const request = stripRouteParameter(stripDataParameter(stripIndexParameter(event.request.clone())));
  const parameters = getURLParameters(request, path);

  return {
    request,
    params: parameters,
    context: loadContext,
  };
}

/**
 * Checks if a request is one of the methods.
 */
function isMethod(request: Request, methods: Array<string>) {
  return methods.includes(request.method.toLowerCase());
}

/**
 * Checks if given request is a loader (`GET`) method.
 */
export function isLoaderMethod(request: Request) {
  return isMethod(request, ['get']);
}

/**
 * Checks if given request is a action (non-`GET`) method.
 */
export function isActionMethod(request: Request) {
  return isMethod(request, ['post', 'delete', 'put', 'patch', 'head']);
}

/**
 * Checks if given request is a action request.
 */
export function isActionRequest(request: Request, spaMode = false) {
  const url = new URL(request.url);
  const qualifies = spaMode ? url.searchParams.get('_route') : url.searchParams.get('_data');
  return isActionMethod(request) && qualifies;
}

/**
 * Checks if given request is a loader request.
 */
export function isLoaderRequest(request: Request, spaMode = false) {
  const url = new URL(request.url);
  const qualifies = spaMode ? url.searchParams.get('_route') : url.searchParams.get('_data');
  return isLoaderMethod(request) && qualifies;
}
