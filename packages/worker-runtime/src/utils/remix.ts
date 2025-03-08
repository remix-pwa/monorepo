import type { DeferredData, TrackedPromise } from '@remix-run/router/dist/utils.js';

export type RedirectFunction = (url: string, init?: number | ResponseInit) => Response;
export type JsonFunction = <Data>(data: Data, init?: number | ResponseInit) => Response;
export type TypedResponse<T = unknown> = Omit<Response, 'json'> & {
  json(): Promise<T>;
};

/**
 * The mode to use when running the server.
 */
export enum ServerMode {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export function isServerMode(value: any): value is ServerMode {
  return value === ServerMode.Development || value === ServerMode.Production || value === ServerMode.Test;
}

export function isDeferredData(value: any): value is DeferredData {
  const deferred: DeferredData = value;
  return (
    deferred &&
    typeof deferred === 'object' &&
    typeof deferred.data === 'object' &&
    typeof deferred.subscribe === 'function' &&
    typeof deferred.cancel === 'function' &&
    typeof deferred.resolveData === 'function'
  );
}

export function isResponse(value: any): value is Response {
  return (
    value != null &&
    typeof value.status === 'number' &&
    typeof value.statusText === 'string' &&
    typeof value.headers === 'object' &&
    typeof value.body !== 'undefined'
  );
}

const redirectStatusCodes = new Set([301, 302, 303, 307, 308]);
export function isRedirectStatusCode(statusCode: number): boolean {
  return redirectStatusCodes.has(statusCode);
}
export function isRedirectResponse(response: Response): boolean {
  return isRedirectStatusCode(response.status);
}

export function isTrackedPromise(value: any): value is TrackedPromise {
  return value != null && typeof value.then === 'function' && value._tracked === true;
}

/**
 * A redirect response. Sets the status code and the `Location` header.
 * Defaults to "302 Found".
 */
export const redirect: RedirectFunction = (url, init = 302) => {
  let responseInit = init;
  if (typeof responseInit === 'number') {
    responseInit = { status: responseInit };
  } else if (typeof responseInit.status === 'undefined') {
    responseInit.status = 302;
  }

  const headers = new Headers(responseInit.headers);
  headers.set('Location', url);

  return new Response(null, {
    ...responseInit,
    headers,
  });
};

/**
 * This is a shortcut for creating `application/json` responses. Converts `data`
 * to JSON and sets the `Content-Type` header.
 */
export const json: JsonFunction = (data, init = {}) => {
  const responseInit = typeof init === 'number' ? { status: init } : init;

  const headers = new Headers(responseInit.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  return new Response(JSON.stringify(data), {
    ...responseInit,
    headers,
  });
};

export function sanitizeError<T = unknown>(error: T, serverMode: ServerMode) {
  if (error instanceof Error && serverMode !== ServerMode.Development) {
    const sanitized = new Error('Unexpected Server Error');
    sanitized.stack = undefined;
    return sanitized;
  }
  return error;
}

// must be type alias due to inference issues on interfaces
// https://github.com/microsoft/TypeScript/issues/15300
export type SerializedError = {
  message: string;
  stack?: string;
};

export function serializeError(error: Error, serverMode: ServerMode): SerializedError {
  const sanitized = sanitizeError(error, serverMode);
  return {
    message: sanitized.message,
    stack: sanitized.stack,
  };
}
