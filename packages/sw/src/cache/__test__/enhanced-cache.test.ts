import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

import { EnhancedCache } from '../EnhancedCache.js';
import CacheMock from './utils/browser-cache-mock.js';

const fetchMocker = createFetchMock(vi);

describe('EnhancedCache Testing Suite', () => {
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

  // This test is funny whilst using same URLs
  test('should work well with different strategies', async () => {
    const cache1 = new EnhancedCache('network-cache', {
      strategy: 'NetworkFirst',
      strategyOptions: {},
    });
    const cache2 = new EnhancedCache('cache-first', {
      strategy: 'CacheFirst',
      strategyOptions: {},
    });
    const cacheFirstCache = await caches.open('cache-first');
    const cacheFirstCacheSpy = vi.spyOn(cacheFirstCache, 'match');

    await cache2.addToCache('http://example.com/cache', new Response('cache response'));

    fetchMocker.mockResponse('network response');

    const response1 = await cache1.handleRequest('http://example.com/network');
    const response2 = await cache2.handleRequest('http://example.com/cache');

    expect(response1).toBeInstanceOf(Response);
    expect(response2).toBeInstanceOf(Response);
    expect(await response1.text()).toBe('network response');
    expect(await response2.text()).toBe('cache response');

    expect(cacheFirstCacheSpy).toHaveBeenCalled();

    cacheFirstCacheSpy.mockRestore();
  });

  test('should add and remove from cache successfully', async () => {
    const cache = new EnhancedCache('cache-first', {
      strategy: 'CacheFirst',
      strategyOptions: {},
    });
    fetchMocker.mockResponse('network response');

    await cache.addToCache('http://example.com/cache', new Response('cache response'));

    const interimResponse = await cache.handleRequest('http://example.com/cache');

    expect(await interimResponse.text()).toBe('cache response');

    await cache.removeFromCache('http://example.com/cache');

    const response = await cache.handleRequest('http://example.com/cache');

    expect(response).toBeInstanceOf(Response);
    expect(await response.text()).toBe('network response');
  });

  test('should successfully clear cache', async () => {
    const cache = new EnhancedCache('cache-first', {
      strategy: 'CacheFirst',
      strategyOptions: {},
    });
    fetchMocker.mockResponse('network response');

    await cache.preCacheUrls([
      'http://example.com/cache-1',
      'http://example.com/cache-2',
      'http://example.com/cache-3',
      'http://example.com/cache-4',
      'http://example.com/cache-5',
    ]);

    await cache.clearCache();

    const response = await cache.handleRequest('http://example.com/cache-1');

    expect(response).toBeInstanceOf(Response);
    expect(await response.text()).toBe('network response');
  });

  test('should successfully purge cache based on filter', async () => {
    const cache = new EnhancedCache('cache-first', {
      strategy: 'CacheFirst',
      strategyOptions: {},
    });
    fetchMocker.mockResponse('network response');

    await cache.preCacheUrls([
      'http://example.com/cache-1',
      'http://example.com/cache-2',
      'http://example.com/cache-3',
      'http://example.com/cache-4',
      'http://example.com/cache-5',
    ]);

    await EnhancedCache.purgeCache(cache, ({ request }) => request.url.includes('cache-1'));

    // Mock the fetch again for any future requests
    fetchMocker.mockResponse('renewed network response');

    const cache1Response = await cache.handleRequest('http://example.com/cache-1');
    const cache2Response = await cache.handleRequest('http://example.com/cache-2');

    expect(cache1Response).toBeInstanceOf(Response);
    expect(cache2Response).toBeInstanceOf(Response);
    expect(await cache1Response.text()).toBe('renewed network response');
    expect(await cache2Response.text()).toBe('network response');
  });

  test('should successfully match cache request', async () => {
    const cache = new EnhancedCache('cache-first', {
      strategy: 'NetworkFirst',
      strategyOptions: {},
    });
    const cacheSpy = vi.spyOn(cache, 'match');

    await cache.addToCache('http://example.com/cache', new Response('cache response'));

    const response = await cache.match('http://example.com/cache');
    const undefinedResponse = await cache.match('http://example.com/undefined');

    expect(response).toBeInstanceOf(Response);
    expect(await response?.text()).toBe('cache response');
    expect(undefinedResponse).toBeUndefined();

    expect(cacheSpy).toHaveBeenCalled();
    expect(cacheSpy).toHaveReturnedWith(response);
    expect(cacheSpy).toHaveLastReturnedWith(undefinedResponse);

    cacheSpy.mockRestore();
  });

  test('should get all cache entries successfully when prompted', async () => {
    const cache = new EnhancedCache('cache-first', {
      strategy: 'CacheOnly',
      strategyOptions: {},
    });

    await cache.addToCache('http://example.com/cache-1', new Response('cache response 1'));
    await cache.addToCache('http://example.com/cache-2', new Response('cache response 2'));
    await cache.addToCache('http://example.com/cache-3', new Response('cache response 3'));

    const cacheEntries = await cache.getCacheEntries();

    expect(cacheEntries).toBeInstanceOf(Array);
    expect(cacheEntries).toHaveLength(3);

    expect(cacheEntries[0].request.url).toBe('http://example.com/cache-1');
    expect(cacheEntries[1].request.url).toBe('http://example.com/cache-2');
    expect(cacheEntries[2].request.url).toBe('http://example.com/cache-3');
  });

  test('should return cache stats', async () => {
    const cache = new EnhancedCache('cache-first', {
      strategy: 'CacheOnly',
      strategyOptions: {},
    });

    await cache.addToCache('http://example.com/cache-1', new Response('cache response 1'));
    await cache.addToCache('http://example.com/cache-2', new Response('cache response 2'));
    await cache.addToCache('http://example.com/cache-3', new Response('cache response 3'));

    const cacheStats = await cache.getCacheStats();

    expect(cacheStats).toBeInstanceOf(Object);
    expect(cacheStats.length).toBe(3);
    expect(cacheStats.totalSize).toBeGreaterThan(0);
  });

  test('should be able to visualize cache efficiently', async () => {
    const cache = new EnhancedCache('cache-first', {
      strategy: 'CacheOnly',
      strategyOptions: {},
    });

    await cache.addToCache('http://example.com/cache-1', new Response('cache response 1'));
    await cache.addToCache('http://example.com/cache-1/sub-cache-1', new Response('sub cache response 1'));
    await cache.addToCache('http://example.com/cache-1/sub-cache-2', new Response('sub cache response 2'));
    await cache.addToCache('http://example.com/cache-2', new Response('cache response 2'));
    await cache.addToCache('http://example.com/cache-3', new Response('cache response 3'));
    await cache.addToCache('http://example.com/cache-3/sub-cache-1', new Response('sub cache response 3'));

    const cacheVisualization = await EnhancedCache.visualizeCache(cache);

    expect(cacheVisualization).toBeInstanceOf(Object);
  });

  test('should compress and decompress responses successfully', async () => {
    const compressedResponse = await EnhancedCache.compressResponse(new Response('compressed response'));
    const uncompressedResponse = await EnhancedCache.decompressResponse(compressedResponse.clone());

    expect(compressedResponse).toBeInstanceOf(Response);
    expect(uncompressedResponse).toBeInstanceOf(Response);
    expect(await compressedResponse.text()).not.toBe('compressed response');
    expect(await uncompressedResponse.text()).toBe('compressed response');
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
