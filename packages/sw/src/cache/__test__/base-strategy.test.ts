/* eslint-disable dot-notation */
import { afterAll, afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { BaseStrategy } from '../BaseStrategy.js';
import type { CacheOptions } from '../types.js';
import CacheMock from './utils/browser-cache-mock.js';

class MockStrategy extends BaseStrategy {
  public _cacheName: string;
  public _options: CacheOptions;

  constructor(cacheName: string, options?: CacheOptions) {
    super(cacheName, options);
    this._cacheName = cacheName;
    this._options = options || {};
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleRequest(_request: Request | string): Promise<Response> {
    return new Response('mock response');
  }

  _ensureRequest(request: Request | string | URL): Request {
    return this.ensureRequest(request);
  }

  async _cleanupCache(): Promise<void> {
    await this.cleanupCache();
  }

  async _openCache(): Promise<Cache> {
    return await this.openCache();
  }
}

describe('BaseStrategy Testing Suite', () => {
  let mockCache: Cache;

  beforeEach(() => {
    mockCache = new CacheMock();
    global.caches = {
      open: vi.fn().mockResolvedValue(mockCache),
      delete: vi.fn().mockResolvedValue(true),
      has: vi.fn().mockResolvedValue(true),
      keys: vi.fn().mockResolvedValue([]),
      match: vi.fn().mockResolvedValue(new Response()),
    };
  });

  test('initializes with the correct cacheName and options', () => {
    const options: CacheOptions = { maxAgeSeconds: 3600, maxEntries: 100 };
    const strategy = new MockStrategy('test-cache', options);

    expect(strategy._cacheName).toBe('test-cache');
    expect(strategy._options).toEqual(options);
  });

  test('opens a cache with the specified cacheName', async () => {
    const strategy = new MockStrategy('test-cache');
    const openCacheSpy = vi.spyOn(caches, 'open');

    const cache = await strategy._openCache();

    expect(openCacheSpy).toHaveBeenCalledWith('test-cache');
    expect(cache).toBe(mockCache);
  });

  test('ensures a Request object', () => {
    const strategy = new MockStrategy('test-cache');
    const request = new Request('https://example.com');
    const stringRequest = 'https://example.com';
    const urlRequest = new URL('https://example.com');

    expect(strategy._ensureRequest(request)).toBe(request);
    expect(strategy._ensureRequest(stringRequest)).toBeInstanceOf(Request);
    expect(strategy._ensureRequest(urlRequest)).toBeInstanceOf(Request);
  });

  test('checks if the route is supported by the strategy', () => {
    const strategy = new MockStrategy('test-cache', { ignoreRoutes: [/\/api\//] });
    const request = new Request('https://example.com/assets/image.jpg');
    const unsupportedRequest = new Request('https://example.com/api/data');

    expect(strategy['isRouteSupported'](request)).toBe(true);
    expect(strategy['isRouteSupported'](unsupportedRequest)).toBe(false);
  });

  test('cleans up the cache based on maxAgeSeconds option', async () => {
    const strategy = new MockStrategy('test-cache', { maxAgeSeconds: 1 }); // 1 second for testing
    const mockCache = {
      delete: vi.fn().mockResolvedValue(true),
      match: vi.fn().mockResolvedValue(
        new Response(null, {
          headers: { 'sw-cache-timestamp': (Date.now() - 2000).toString() }, // 2 seconds ago
        })
      ),
      keys: vi.fn().mockResolvedValue(['request1']),
    };
    vi.spyOn(caches, 'open').mockResolvedValue(mockCache as unknown as Cache);

    await strategy._cleanupCache();

    expect(mockCache.delete).toHaveBeenCalledTimes(1);
    expect(mockCache.delete).toHaveBeenCalledWith('request1');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.clearAllMocks();
  });
});
