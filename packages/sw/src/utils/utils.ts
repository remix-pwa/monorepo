export type RedirectFunction = (url: string, init?: number | ResponseInit) => Response;

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

export type JsonFunction = <Data>(data: Data, init?: number | ResponseInit) => Response;

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

/**
 * Automatically check the method of a request against a list of methods.
 *
 * @param request The request to check.
 * @param methods The list of methods to check against.
 * @returns Whether the request method is in the list of methods.
 */
export function isMethod(request: Request, methods: string[]): boolean {
  return methods.includes(request.method.toLowerCase());
}

/**
 * Default checker for loader requests. Determine wether a request is for loader or not.
 *
 * @param request The request to check.
 * @returns {string | false | null} Whether the request is for loader or not.
 */
export function isLoaderRequest(request: Request): string | false | null {
  const url = new URL(request.url);
  return isMethod(request, ['get']) && url.searchParams.get('_data');
}

/**
 * Checks if given request is a action request.
 *
 * @param request The request to check.
 * @returns {string | false | null} Whether the request is for action or not.
 */
export function isActionRequest(request: Request): string | false | null {
  const url = new URL(request.url);
  return isMethod(request, ['post', 'delete', 'put', 'patch']) && url.searchParams.get('_data');
}

/**
 * Checks if the given request is a document navigation event (client-side) navigation
 *
 * @param request The request to check
 * @returns {boolean} Wether the request is a document request
 */
export function isDocumentRequest(request: Request): boolean {
  return isMethod(request, ['get']) && request.mode === 'navigate';
}

/**
 * Returns a promise that resolves and the passed number of milliseconds.
 * This utility is an async/await-friendly version of `setTimeout`.
 *
 * Can also be utilized as a sleep/delay function.
 *
 * @param {number} ms
 * @return {Promise}
 * @private
 */
export function timeout(ms: number): Promise<unknown> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Checks if the passed request is an HTTP request.
 *
 * @param {Request | URL} request
 * @return {boolean}
 * @private
 */
export const isHttpRequest = (request: Request | URL): boolean => {
  if (request instanceof Request) {
    return request.url.startsWith('http');
  }

  return request.toString().startsWith('http');
};

/**
 * Converts a response to JSON.
 */
export const toJSON = async (response: Response | any) => {
  if (response instanceof Response) {
    return await response.clone().json();
  }

  return response;
};
