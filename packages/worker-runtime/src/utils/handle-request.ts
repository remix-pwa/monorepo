import type {
  DefaultErrorHandler,
  DefaultFetchHandler,
  WorkerLoadContext,
  WorkerLoaderFunction,
  WorkerRouteManifest,
} from '@remix-pwa/dev/worker-build.js';
import { isRouteErrorResponse } from '@remix-run/router';
import { ServerMode } from '@remix-run/server-runtime/dist/mode.js';
import type { TypedResponse } from '@remix-run/server-runtime/dist/responses.js';
import {
  createDeferredReadableStream,
  isDeferredData,
  isRedirectResponse,
  isRedirectStatusCode,
  isResponse,
  json,
  redirect,
} from '@remix-run/server-runtime/dist/responses.js';

import { createArgumentsFrom, getURLParameters, isActionRequest, isLoaderRequest } from './request.js';
import { errorResponseToJson, isRemixResponse } from './response.js';

interface HandleRequestArgs {
  defaultHandler: DefaultFetchHandler;
  errorHandler: DefaultErrorHandler;
  event: FetchEvent;
  loadContext: WorkerLoadContext;
  routes: WorkerRouteManifest;
}
interface HandleArgs {
  event: FetchEvent;
  loadContext: WorkerLoadContext;
  routeId: string;
}
interface HandleLoaderArgs extends HandleArgs {
  loader: WorkerLoaderFunction;
}
interface HandleActionArgs extends HandleArgs {
  action: WorkerLoaderFunction;
}
interface HandleError {
  error: unknown;
  handler: (error: Error) => void;
}

/**
 * A FetchEvent handler for Remix.
 * If the `event.request` has a worker loader/action defined, it will call it and return the response.
 * Otherwise, it will call the default handler...
 */
export async function handleRequest({
  defaultHandler,
  errorHandler,
  event,
  loadContext,
  routes,
}: HandleRequestArgs): Promise<Response> {
  const { request } = event;

  const url = new URL(request.url);
  const routeId = url.searchParams.get('_data');
  // if the request is not a loader or action request, we call the default handler and the routeId will be undefined
  const route = routeId ? routes[routeId] : undefined;

  try {
    if (isLoaderRequest(request) && route?.module.workerLoader) {
      return await handleLoader({
        event,
        loader: route.module.workerLoader,
        routeId: route.id,
        loadContext,
      }).then(responseHandler);
    }

    if (isActionRequest(request) && route?.module?.workerAction) {
      return await handleAction({
        event,
        action: route.module.workerAction,
        routeId: route.id,
        loadContext,
      }).then(responseHandler);
    }
  } catch (error) {
    const handler = (error: Error) => errorHandler(error, createArgumentsFrom({ event, loadContext }));
    return _errorHandler({ error, handler });
  }

  // If the request is a non-GET request and we don't have an action in that route,
  // fetch it like normal.
  //
  // This is a precautionary move, you might not rely on this if your default handler just
  // handles GET requests but just in case...
  if (request.method.toUpperCase() !== 'GET') {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `You made a non-GET request to route "${routeId}" but didn't define a workerAction function. ` +
          `We're treating this request like a normal fetch request.`
      );
    }

    return fetch(request.clone());
  }

  return defaultHandler({
    request,
    params: getURLParameters(request),
    context: loadContext,
  });
}

/**
 * Handle a Remix worker loader request.
 */
async function handleLoader({ event, loadContext, loader, routeId }: HandleLoaderArgs): Promise<Response> {
  const _arguments = createArgumentsFrom({ event, loadContext });
  const result = await loader(_arguments);

  if (result === undefined) {
    throw new Error(
      `You defined a loader for route "${routeId}" but didn't return ` +
        `anything from your \`loader\` function. Please return a value or \`null\`.`
    );
  }

  if (isDeferredData(result)) {
    if (result.init && isRedirectStatusCode(result.init.status || 200)) {
      return redirect(new Headers(result.init.headers).get('Location') as string, result.init);
    }

    const body = createDeferredReadableStream(result, event.request.signal, ServerMode.Production);
    const init = result.init || {};
    const headers = new Headers(init.headers);
    headers.set('Content-Type', 'text/remix-deferred');
    init.headers = headers;

    return new Response(body, init);
  }

  return isResponse(result) ? result : json(result);
}

/**
 * Handle a Remix worker action request.
 */
async function handleAction({ action, event, loadContext, routeId }: HandleActionArgs): Promise<Response> {
  const _arguments = createArgumentsFrom({ event, loadContext });
  const result = await action(_arguments);

  if (result === undefined) {
    throw new Error(
      `You defined an action for route "${routeId}" but didn't return ` +
        `anything from your \`action\` function. Please return a value or \`null\`.`
    );
  }

  return isResponse(result) ? result : json(result);
}

/**
 * Takes an data route error and returns remix expected json response
 */
function _errorHandler({ error, handler: handleError }: HandleError): TypedResponse<{ message: string }> {
  if (isResponse(error)) {
    error.headers.set('X-Remix-Catch', 'yes');
    return error;
  }

  if (isRouteErrorResponse(error)) {
    if (error.error) {
      handleError(error.error);
    }
    return errorResponseToJson(error);
  }

  const errorInstance = error instanceof Error ? error : new Error('Unexpected Server Error');

  handleError(errorInstance);

  return json(
    { message: errorInstance.message },
    {
      status: 500,
      headers: {
        'X-Remix-Error': 'yes',
      },
    }
  );
}

/**
 * Takes a response and returns a new response with the remix expected headers and status
 */
function responseHandler(response: Response): Response {
  if (isRedirectResponse(response)) {
    // We don't have any way to prevent a fetch request from following
    // redirects. So we use the `X-Remix-Redirect` header to indicate the
    // next URL, and then "follow" the redirect manually on the client.
    const headers = new Headers(response.headers);
    headers.set('X-Remix-Redirect', headers.get('Location') as string);
    headers.set('X-Remix-Status', String(response.status));
    headers.delete('Location');
    if (response.headers.get('Set-Cookie') !== null) {
      headers.set('X-Remix-Revalidate', 'yes');
    }

    return new Response(null, {
      status: 204,
      headers,
    });
  }

  // Mark all successful responses with a header so we can identify in-flight
  // network errors that are missing this header
  !isRemixResponse(response) && response.headers.set('X-Remix-Response', 'yes');
  return response;
}
