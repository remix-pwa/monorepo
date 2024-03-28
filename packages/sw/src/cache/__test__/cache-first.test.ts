import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

import { CacheFirst } from '../CacheFirst.js';
import CacheMock from './utils/browser-cache-mock.js';

const fetchMocker = createFetchMock(vi);

describe('CacheFirst Strategy Testing Suite', () => {
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

  test('should fetch from cache first if available', async () => {
    const strategy = new CacheFirst('test-cache');
    const mockResponse = new Response('cached response', {
      headers: { 'sw-cache-timestamp': Date.now().toString() }, // adding this so it matches
    });
    const cache = await caches.open('test-cache');

    await cache.put('http://localhost/test', mockResponse);

    const response = await strategy.handleRequest('http://localhost/test');
    const text = await response.text();

    expect(text).toBe('cached response');
    expect(global.caches.open).toHaveBeenCalledWith('test-cache');
  });

  test('should fetch from network if not in cache', async () => {
    const strategy = new CacheFirst('test-cache');
    fetchMocker.mockResponseOnce('network response');

    const response = await strategy.handleRequest('http://localhost/not-in-cache');
    const text = await response.text();

    expect(text).toBe('network response');
    expect(fetchMocker.requests()[0].url).toEqual('http://localhost/not-in-cache');
  });

  test('should cache network response if valid', async () => {
    const strategy = new CacheFirst('test-cache', { cacheableResponse: { statuses: [200] } });
    fetchMocker.mockResponseOnce('network response');

    await strategy.handleRequest('http://localhost/to-cache');

    const cache = await caches.open('test-cache');
    const cachedResponse = await cache.match('http://localhost/to-cache');
    const text = await cachedResponse?.text();

    expect(text).toBe('network response');
  });

  test("should not cache response if the response status isn't valid", async () => {
    const strategy = new CacheFirst('test-cache', { cacheableResponse: { statuses: [200] } });
    fetchMocker.mockResponseOnce('network response', { status: 404 });

    await strategy.handleRequest('http://localhost/to-cache');

    const cache = await caches.open('test-cache');
    const cachedResponse = await cache.match('http://localhost/to-cache');

    expect(cachedResponse).toBeUndefined();
  });

  test('should cache every status under the sun if no statuses are provided', async () => {
    const strategy = new CacheFirst('test-cache', { cacheableResponse: {} });

    fetchMocker.mockResponseOnce('network response (404)', { status: 404 });
    await strategy.handleRequest('http://localhost/to-cache-1');

    fetchMocker.mockResponseOnce('network response (500)', { status: 500 });
    await strategy.handleRequest('http://localhost/to-cache-2');

    const cache = await caches.open('test-cache');

    const cachedResponse1 = await cache.match('http://localhost/to-cache-1');
    const cachedResponse2 = await cache.match('http://localhost/to-cache-2');

    // eslint-disable-next-line camelcase
    const text_404 = await cachedResponse1?.text();
    // eslint-disable-next-line camelcase
    const text_500 = await cachedResponse2?.text();

    expect(text_404).toBe('network response (404)');
    expect(text_500).toBe('network response (500)');
  });

  test("should not cache the response if the response headers aren't valid", async () => {
    const strategy = new CacheFirst('test-cache', {
      cacheableResponse: { headers: { 'x-test': 'true' } },
    });

    fetchMocker.mockResponseOnce('network response', { headers: { 'x-test': 'false' } });
    await strategy.handleRequest('http://localhost/to-cache-1');

    fetchMocker.mockResponseOnce('network response', { headers: { 'something-else': 'custom-data' } });
    await strategy.handleRequest('http://localhost/to-cache-2');

    const cache = await caches.open('test-cache');
    const cachedResponse1 = await cache.match('http://localhost/to-cache-1');
    const cachedResponse2 = await cache.match('http://localhost/to-cache-2');

    expect(cachedResponse1).toBeUndefined();
    expect(cachedResponse2).toBeUndefined();
  });

  test('should fetch from network if cache item has expired', async () => {
    const strategy = new CacheFirst('test-cache', { maxAgeSeconds: 10 }); // because default maxAgeSeconds is a month, we shorten it.
    const expiredResponse = new Response('expired response', {
      headers: { 'sw-cache-timestamp': (Date.now() - 1_000_000).toString() },
    });
    const cache = await caches.open('test-cache');

    await cache.put('http://localhost/expired', expiredResponse);

    fetchMocker.mockResponseOnce('network response');

    const response = await strategy.handleRequest('http://localhost/expired');
    const text = await response.text();

    expect(text).toBe('network response');
  });

  test('should have a default maximum size of 50 items', async () => {
    const strategy = new CacheFirst('test-cache');
    const cache = await caches.open('test-cache');

    for (let i = 0; i < 55; i++) {
      await cache.put(`http://localhost/${i}`, new Response(`item-${i}`));
    }

    await strategy.handleRequest('http://localhost/0');

    const keys = await cache.keys();
    expect(keys.length).toBe(50);
  });

  test('should respect the maximum size option', async () => {
    const strategy = new CacheFirst('test-cache', { maxEntries: 10 });
    const cache = await caches.open('test-cache');

    for (let i = 0; i < 12; i++) {
      await cache.put(`http://localhost/${i}`, new Response(`item-${i}`));
    }

    await strategy.handleRequest('http://localhost/0');

    const keys = await cache.keys();
    expect(keys.length).toBe(10);
  });

  afterEach(() => {
    fetchMocker.resetMocks();
    vi.restoreAllMocks();
  });

  afterAll(() => {
    fetchMocker.disableMocks();
    vi.clearAllMocks();
  });
});
