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
