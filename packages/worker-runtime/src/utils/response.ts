import type { ErrorResponse } from '@remix-run/router';
import { json } from '@remix-run/server-runtime/dist/responses.js';

/**
 * Converts an error response to a JSON response.
 */
export function errorResponseToJson(errorResponse: ErrorResponse) {
  // @ts-expect-error
  return json(errorResponse.error || { message: 'Unexpected Server Error' }, {
    status: errorResponse.status,
    statusText: errorResponse.statusText,
    headers: {
      'X-Remix-Error': 'yes',
    },
  });
}

/**
 * Checks if a response is a Remix response by checking if it has any `X-Remix` headers.
 */
export function isRemixResponse(response: Response) {
  return Array.from(response.headers.keys()).some(key => key.toLowerCase().startsWith('x-remix-'));
}
