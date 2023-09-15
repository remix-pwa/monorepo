import { UNSAFE_ErrorResponseImpl } from '@remix-run/router';
import { describe, expect, test } from 'vitest';

import { errorResponseToJson, isRemixResponse } from '../response.js';

describe('errorResponseToJson', () => {
  test('should return a JSON response with the error message and status', () => {
    const errorResponse = new UNSAFE_ErrorResponseImpl(500, 'Internal Server Error', {});

    const response = errorResponseToJson(errorResponse);
    expect(response).toHaveProperty('status', errorResponse.status);
    expect(response).toHaveProperty('statusText', errorResponse.statusText);
  });

  test('should return a JSON response with the default error message and status if no error is provided', () => {
    const errorResponse = new UNSAFE_ErrorResponseImpl(500, 'Internal Server Error', {});

    const response = errorResponseToJson(errorResponse);
    expect(response).toHaveProperty('status', errorResponse.status);
    expect(response).toHaveProperty('statusText', errorResponse.statusText);
  });

  test('should include the X-Remix-Error header', () => {
    const response = errorResponseToJson(new UNSAFE_ErrorResponseImpl(500, 'Internal Server Error', {}));
    expect(response.headers.has('X-Remix-Error')).toBeTruthy();
  });

  test('`true` when the response has any header that starts with `x-remix-`', () => {
    expect(isRemixResponse(new Response(null, { headers: { 'X-Remix-mock': 'true' } }))).toBeTruthy();
    expect(isRemixResponse(new Response(null, { headers: { 'x-remix-mock-2': 'true' } }))).toBeTruthy();
  });

  test('`false` when the response has any header that starts with `x-remix-`', () => {
    expect(isRemixResponse(new Response(null))).toBeFalsy();
  });
});
