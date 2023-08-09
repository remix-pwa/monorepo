import type { WorkerLoadContext } from '@remix-pwa/dev/worker-build.js';

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
export function getURLParameters(request: Request): Record<string, string> {
  return Object.fromEntries(new URL(request.url).searchParams.entries());
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
 * Creates arguments for the Worker Actions and Loaders.
 */
export function createArgumentsFrom({ event, loadContext }: { event: FetchEvent; loadContext: WorkerLoadContext }) {
  const request = stripDataParameter(stripIndexParameter(event.request.clone()));
  const parameters = getURLParameters(request);

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
 * Checks if given request is a action request.
 */
export function isActionRequest(request: Request) {
  const url = new URL(request.url);
  return isMethod(request, ['post', 'delete', 'put', 'patch']) && url.searchParams.get('_data');
}

/**
 * Checks if given request is a loader request.
 */
export function isLoaderRequest(request: Request) {
  const url = new URL(request.url);
  return isMethod(request, ['get']) && url.searchParams.get('_data');
}
