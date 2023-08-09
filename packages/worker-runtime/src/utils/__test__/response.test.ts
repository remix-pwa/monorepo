import { describe, expect, test } from 'vitest';
import { ErrorResponse } from '@remix-run/router';

import { errorResponseToJson } from '../response.js';

describe('errorResponseToJson', () => {
  test('should return a JSON response with the error message and status', () => {
    const errorResponse = new ErrorResponse(500, 'Internal Server Error', {});

    const response = errorResponseToJson(errorResponse);
    expect(response).toHaveProperty('status', errorResponse.status);
    expect(response).toHaveProperty('statusText', errorResponse.statusText);
  });

  test('should return a JSON response with the default error message and status if no error is provided', () => {
    const errorResponse = new ErrorResponse(500, 'Internal Server Error', {});

    const response = errorResponseToJson(errorResponse);
    expect(response).toHaveProperty('status', errorResponse.status);
    expect(response).toHaveProperty('statusText', errorResponse.statusText);
  });

  test('should include the X-Remix-Error header', () => {
    const response = errorResponseToJson(new ErrorResponse(500, 'Internal Server Error', {}));
    expect(response.headers.has('X-Remix-Error')).toBeTruthy();
  });
});
