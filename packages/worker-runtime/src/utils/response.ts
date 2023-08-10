import type { ErrorResponse } from '@remix-run/router';
import { json } from '@remix-run/server-runtime/dist/responses.js';

/**
 * Converts an error response to a JSON response.
 */
export function errorResponseToJson(errorResponse: ErrorResponse) {
  return json(errorResponse.error || new Error('Unexpected Server Error'), {
    status: errorResponse.status,
    statusText: errorResponse.statusText,
    headers: {
      'X-Remix-Error': 'yes',
    },
  });
}
