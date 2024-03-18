import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

  async handleRequest(request: Request | string): Promise<Response> {
    return new Response('mock response');
  }

  async _cleanupCache(): Promise<void> {
    await this.cleanupCache();
  }

  async _openCache(): Promise<Cache> {
    return await this.openCache();
  }
}

describe('BaseStrategy', () => {
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

  it('initializes with the correct cacheName and options', () => {
    const options: CacheOptions = { maxAgeSeconds: 3600, maxEntries: 100 };
    const strategy = new MockStrategy('test-cache', options);

    expect(strategy._cacheName).toBe('test-cache');
    expect(strategy._options).toEqual(options);
  });

  it('opens a cache with the specified cacheName', async () => {
    const strategy = new MockStrategy('test-cache');
    const openCacheSpy = vi.spyOn(caches, 'open');

    const cache = await strategy._openCache();

    expect(openCacheSpy).toHaveBeenCalledWith('test-cache');
    expect(cache).toBe(mockCache);
  });

  it('cleans up the cache based on maxAgeSeconds option', async () => {
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
