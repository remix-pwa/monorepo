import type { ErrorResponse } from '@remix-run/router';

/**
 * Converts an error response to a JSON response.
 */
export function errorResponseToJson(errorResponse: ErrorResponse) {
  // @ts-expect-error
  return errorResponse.error || { message: 'Unexpected Server Error' }, {
    status: errorResponse.status,
    statusText: errorResponse.statusText,
    headers: {
      'X-Remix-Error': 'yes',
    },
  };
}

/**
 * Checks if a response is a Remix response by checking if it has any `X-Remix` headers.
 */
export function isRemixResponse(response: Response) {
  return Array.from(response.headers.keys()).some(key => key.toLowerCase().startsWith('x-remix-'));
}
