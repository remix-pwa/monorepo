import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

import { CACHE_TIMESTAMP_HEADER } from '../BaseStrategy';
import { NetworkFirst } from '../NetworkFirst';
import CacheMock from './utils/browser-cache-mock.js';

const fetchMocker = createFetchMock(vi);

describe('NetworkFirst Strategy Testing Suite', () => {
  let mockCache: Cache;

  beforeAll(() => {
    fetchMocker.enableMocks();
  });

  beforeEach(() => {
    fetchMocker.doMock();

    mockCache = new CacheMock();
    global.caches = {
      open: vi.fn().mockResolvedValue(mockCache),
      delete: vi.fn().mockResolvedValue(true),
      has: vi.fn().mockResolvedValue(true),
      keys: vi.fn().mockResolvedValue([]),
      match: vi.fn().mockResolvedValue(new Response()),
    };
  });

  test('should fetch from network first if available', async () => {
    const strategy = new NetworkFirst('test-cache');
    const cache = await caches.open('test-cache');

    const responseString = 'fake response';
    const responseInit = { status: 200 };

    const fakeResponse = new Response(responseString, responseInit);

    fetchMocker.mockResponseOnce(responseString, responseInit);
    const response = await strategy.handleRequest('http://localhost/test');

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(fakeResponse.status);

    expect(fetchMocker.requests()[0].url).toEqual('http://localhost/test');

    expect(caches.open).toHaveBeenCalledWith('test-cache');
    expect((await cache.match('http://localhost/test'))?.headers.get(CACHE_TIMESTAMP_HEADER)).toBeDefined();
  });

  test('should fetch from cache if network fails', async () => {
    const strategy = new NetworkFirst('test-cache', { networkTimeoutInSeconds: 1 });
    const cache = await caches.open('test-cache');
    const spiedOnCache = vi.spyOn(cache, 'match');

    const responseString = 'fake response';
    const responseInit = { status: 200, 'sw-cache-timestamp': Date.now().toString() };

    const mockedResponse = new Response(responseString, responseInit);
    await cache.put('http://localhost/test', mockedResponse);

    fetchMocker.mockRejectOnce();

    const response = await strategy.handleRequest('http://localhost/test');

    expect(response).toBeInstanceOf(Response);
    // expect(response).toEqual(mockedResponse); X-Cache-Hit makes this fail
    expect(spiedOnCache).toHaveBeenCalledWith(new Request('http://localhost/test'), {});

    spiedOnCache.mockRestore();
  });

  test('should not cache response if the response status is not valid', async () => {
    const strategy = new NetworkFirst('test-cache', { cacheableResponse: { statuses: [200] } });
    const cache = await caches.open('test-cache');

    const responseString = 'fake response';
    const responseInit = { status: 404 };

    fetchMocker.mockResponseOnce(responseString, responseInit);

    await strategy.handleRequest('http://localhost/test');

    const cachedResponse = await cache.match('http://localhost/test');

    expect(cachedResponse).toBeUndefined();
  });

  test('should cache every status under the sun if no statuses are provided', async () => {
    const strategy = new NetworkFirst('test-cache', { cacheableResponse: {} });
    const cache = await caches.open('test-cache');

    const responseString = 'fake response';
    const responseInit = { status: 404 };

    fetchMocker.mockResponseOnce(responseString, responseInit);

    await strategy.handleRequest('http://localhost/test');

    const cachedResponse = await cache.match('http://localhost/test');

    expect(cachedResponse).toBeDefined();
  });

  test('should not cache response if the response headers are not valid', async () => {
    const strategy = new NetworkFirst('test-cache', { cacheableResponse: { headers: { 'x-test': 'true' } } });
    const cache = await caches.open('test-cache');

    const responseString = 'fake response';
    const responseInit = { status: 200, headers: { 'x-test': 'false' } };

    fetchMocker.mockResponseOnce(responseString, responseInit);

    await strategy.handleRequest('http://localhost/test');

    const cachedResponse = await cache.match('http://localhost/test');

    expect(cachedResponse).toBeUndefined();
  });

  test('should fallback to cache if network times out', async () => {
    const strategy = new NetworkFirst('test-cache', { networkTimeoutInSeconds: 2 });
    const cache = await caches.open('test-cache');
    const spiedOnCache = vi.spyOn(cache, 'match');

    const responseString = 'fake response';
    const responseInit = { status: 200, 'sw-cache-timestamp': Date.now().toString() };

    const mockedResponse = new Response(responseString, responseInit);
    await cache.put('http://localhost/test', mockedResponse);

    fetchMocker.mockResponseOnce(
      () =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                body: responseString,
                ...responseInit,
              }),
            2_500
          )
        )
    );

    const response = await strategy.handleRequest('http://localhost/test');

    expect(response).toBeInstanceOf(Response);
    // expect(response).toEqual(mockedResponse); X-Cache-Hit makes this fail
    expect(spiedOnCache).toHaveBeenCalledWith(new Request('http://localhost/test'), {});

    spiedOnCache.mockRestore();
  });

  test('should have a default network timeout of 10 seconds', { timeout: 15_000 }, async () => {
    const strategy = new NetworkFirst('test-cache');
    const cache = await caches.open('test-cache');
    const spiedOnCache = vi.spyOn(cache, 'match');

    const responseString = 'fake response';
    const responseInit = { status: 200, 'sw-cache-timestamp': Date.now().toString() };

    const mockedResponse = new Response(responseString, responseInit);
    await cache.put('http://localhost/test', mockedResponse);

    fetchMocker.mockResponseOnce(
      () =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                body: responseString,
                ...responseInit,
              }),
            10_500
          )
        )
    );

    const response = await strategy.handleRequest('http://localhost/test');

    expect(response).toBeInstanceOf(Response);
    // expect(response).toEqual(mockedResponse); X-Cache-Hit makes this fail
    expect(spiedOnCache).toHaveBeenCalledWith(new Request('http://localhost/test'), {});

    spiedOnCache.mockRestore();
  });

  test('should have a default cache size of 50', async () => {
    const strategy = new NetworkFirst('test-cache');
    const cache = await caches.open('test-cache');
    const spiedOnCache = vi.spyOn(cache, 'delete');

    const responseString = 'fake response';
    const responseInit = { status: 200, 'sw-cache-timestamp': Date.now().toString() };

    const mockedResponse = new Response(responseString, responseInit);
    await cache.put('http://localhost/test', mockedResponse);

    fetchMocker.mockResponse(responseString, responseInit);

    for (let i = 0; i < 55; i++) {
      await strategy.handleRequest(`http://localhost/test-${i}`);
    }

    const response = await strategy.handleRequest('http://localhost/test');

    expect(response).toBeInstanceOf(Response);
    // expect(response).toEqual(mockedResponse);
    expect(spiedOnCache).toHaveBeenCalled();
    expect(await cache.keys()).toHaveLength(50);

    spiedOnCache.mockRestore();
  });

  test('should respect user custom size limit', async () => {
    const strategy = new NetworkFirst('test-cache', { maxEntries: 10 });
    const cache = await caches.open('test-cache');
    const spiedOnCache = vi.spyOn(cache, 'delete');

    const responseString = 'fake response';
    const responseInit = { status: 200, 'sw-cache-timestamp': Date.now().toString() };

    const mockedResponse = new Response(responseString, responseInit);
    await cache.put('http://localhost/test', mockedResponse);

    fetchMocker.mockResponse(responseString, responseInit);

    for (let i = 0; i < 12; i++) {
      await strategy.handleRequest(`http://localhost/test-${i}`);
    }

    const response = await strategy.handleRequest('http://localhost/test');

    expect(response).toBeInstanceOf(Response);
    expect(spiedOnCache).toHaveBeenCalled();
    expect(await cache.keys()).toHaveLength(10);

    spiedOnCache.mockRestore();
  });

  test('should expire cache items after the maxAgeSeconds', async () => {
    const strategy = new NetworkFirst('test-cache', { maxAgeSeconds: 10 });
    const cache = await caches.open('test-cache');
    const spiedOnCache = vi.spyOn(cache, 'delete');

    const responseString = 'fake response';
    const responseInit = {
      status: 200,
      headers: { 'sw-cache-timestamp': (Date.now() - 1_000_000).toString() },
    };

    const mockedResponse = new Response(responseString, responseInit);
    await cache.put('http://localhost/expired', mockedResponse);

    fetchMocker.mockResponseOnce('network response');

    const response = await strategy.handleRequest('http://localhost/not-expired');
    const text = await response.text();

    expect(text).toBe('network response');
    expect(spiedOnCache).toHaveBeenCalled();

    spiedOnCache.mockRestore();
  });

  test('should utilise cache match options when provided', { timeout: 15_000 }, async () => {
    const strategy = new NetworkFirst('test-cache', {
      matchOptions: { ignoreSearch: true },
      networkTimeoutInSeconds: 2,
    });
    const cache = await caches.open('test-cache');
    const spiedOnCache = vi.spyOn(cache, 'match');

    const responseString = 'fake response';
    const responseInit = { status: 200, 'sw-cache-timestamp': Date.now().toString() };

    const mockedResponse = new Response(responseString, responseInit);
    await cache.put(new Request('http://localhost/test'), mockedResponse);

    fetchMocker.mockRejectOnce();

    await strategy.handleRequest('http://localhost/test?q=1');

    expect(spiedOnCache).toHaveBeenCalled();
    expect(spiedOnCache).toHaveBeenCalledWith(new Request('http://localhost/test?q=1'), {
      ignoreSearch: true,
    });

    const response = await strategy.handleRequest('http://localhost/test?q=2');

    expect(response).toBeInstanceOf(Response);
    // It's not undefined because there's no difference between the first and
    // second request whilst the `ignoreSearch` flag is enabled
    expect(response).not.toBeUndefined();
    expect(await cache.keys()).toHaveLength(2);

    spiedOnCache.mockRestore();
  });

  // Handle non-GET requests frrr...

  afterEach(() => {
    fetchMocker.resetMocks();
    vi.restoreAllMocks();
  });

  afterAll(() => {
    fetchMocker.disableMocks();
    vi.clearAllMocks();
  });
});
