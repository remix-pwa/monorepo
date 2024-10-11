import type { WorkerLoadContext } from '@remix-pwa/dev/worker-build.js';
import { describe, expect, test } from 'vitest';

import {
  clone,
  createArgumentsFrom,
  getURLParameters,
  isActionRequest,
  stripDataParameter,
  stripIndexParameter,
  stripRouteParameter,
} from '../request.js';

describe('clone', () => {
  test('should create a shallow copy of an object', () => {
    const obj = { a: 1, b: 2 };
    const copy = clone(obj);

    expect(copy).toEqual(obj);
    expect(copy).not.toBe(obj);
    expect(clone(new Request(new URL('https://example.com/test?a=1&b=2')))).toHaveProperty(
      'url',
      'https://example.com/test?a=1&b=2'
    );
  });
});

describe('getURLParameters', () => {
  test('should return an object with URL parameters', () => {
    const request = new Request('https://example.com/test?a=1&b=2');
    const params = getURLParameters(request);

    expect(params).toEqual({ a: '1', b: '2' });
  });
});

describe('stripIndexParam', () => {
  test('should remove index parameters from the URL', () => {
    const request = new Request('https://example.com/test?index');
    const stripped = stripIndexParameter(request);

    expect(stripped.url).toBe('https://example.com/test');
    expect(stripped.headers).toEqual(request.headers);
    // this duplex data somehow is not visible on the Request object
    // expect(stripped.duplex).toBe('half');
  });
  test('should keep index values with specific values', () => {
    const request = new Request('https://example.com/test?index=1&index=2&index');
    const stripped = stripIndexParameter(request);

    expect(stripped.url).toBe('https://example.com/test?index=1&index=2');
    expect(stripped.headers).toEqual(request.headers);
  });
});

describe('stripDataParam', () => {
  test('should remove _data parameter from the URL', () => {
    const request = new Request('https://example.com/test?_data=test');
    const stripped = stripDataParameter(request);

    expect(stripped.url).toBe('https://example.com/test');
    expect(stripped.headers).toEqual(request.headers);
  });
});

describe('stripRouteParam', () => {
  test('should remove _route parameter from the URL', () => {
    const request = new Request('https://example.com/test?_route=root');
    const stripped = stripRouteParameter(request);

    expect(stripped.url).toBe('https://example.com/test');
    expect(stripped.headers).toEqual(request.headers);
  });
});

describe('createArgumentsFrom', () => {
  test('should create an object with request, params, and context properties', () => {
    const event = {
      request: new Request('https://example.com/test?a=1&_route=test&b=2&index&_data=test'),
    } as FetchEvent;
    const loadContext = {} as WorkerLoadContext;

    const args = createArgumentsFrom({ event, loadContext });

    expect(args.request.url).toBe('https://example.com/test?a=1&b=2');
    expect(args.params).toEqual({ a: '1', b: '2' });
    expect(args.context).toBe(loadContext);
  });
});

describe('isActionRequest', () => {
  test('should return true for action requests', () => {
    const request = new Request('https://example.com/test?_data=test', { method: 'POST' });
    const isAction = isActionRequest(request);

    expect(isAction).toBeTruthy();
  });

  test('should return true for clientAction requests in SPA mode', () => {
    const request = new Request('https://example.com/test?_route=test', { method: 'POST' });
    const isAction = isActionRequest(request, true);

    expect(isAction).toBeTruthy();
  });

  test('should return false for non-action requests', () => {
    const request = new Request('https://example.com/test?a=1&b=2');
    const isAction = isActionRequest(request);

    expect(isAction).toBe(false);
  });
});
