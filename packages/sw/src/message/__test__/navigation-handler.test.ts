/* eslint-disable no-void */
/* eslint-disable dot-notation */
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

import { NavigationHandler } from '../NavigationHandler';

const fetchMocker = createFetchMock(vi);

describe('NavigationHandler testing Suite', () => {
  let cache: any;

  beforeAll(() => {
    fetchMocker.enableMocks();
  });

  beforeEach(() => {
    fetchMocker.doMock();

    fetchMocker.mockResponse('response');

    cache = {
      match: vi.fn().mockResolvedValue(void 0),
      strategy: {
        constructor: {
          name: 'NetworkFirst',
        },
      },
      handleRequest: vi.fn().mockResolvedValue(void 0),
      addToCache: vi.fn().mockResolvedValue(void 0),
    };
  });

  test('constructor correctly assigns options', () => {
    const cache = {} as any;
    const allowList = [/^\/$/];
    const denyList = [/^\/$/];
    const navigationHandler = new NavigationHandler({
      cache,
      allowList,
      denyList,
    });

    expect(navigationHandler['allowList']).toBe(allowList);
    expect(navigationHandler['denyList']).toBe(denyList);
    expect(navigationHandler['documentCache']).toBe(cache);
  });

  test('handleNavigation correctly handles navigation event', async () => {
    const navigationHandler = new NavigationHandler({
      cache,
    });

    const event = {
      data: {
        type: 'REMIX_NAVIGATION',
        payload: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
          },
          isSsr: true,
        },
      },
    } as any;

    await navigationHandler.handleMessage(event);

    expect(cache.match).toHaveBeenCalledTimes(1);
    expect(cache.match).toHaveBeenCalledWith('/');
  });

  test('handleNavigation correctly handles navigation event with allowList', async () => {
    const allowList = [/^\/$/];
    const navigationHandler = new NavigationHandler({
      cache,
      allowList,
    });

    const event = {
      data: {
        type: 'REMIX_NAVIGATION',
        payload: {
          location: {
            pathname: '/about',
            search: '',
            hash: '',
          },
          isSsr: true,
        },
      },
    } as any;

    await navigationHandler.handleMessage(event);

    expect(cache.handleRequest).toHaveBeenCalledTimes(0);
  });

  test("handleNavigation correctly handles navigation event with denyList (doesn't handle it)", async () => {
    const denyList = [/^\/$/];
    const navigationHandler = new NavigationHandler({
      cache,
      denyList,
    });

    const event = {
      data: {
        type: 'REMIX_NAVIGATION',
        payload: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
          },
          isSsr: true,
        },
      },
    } as any;

    await navigationHandler.handleMessage(event);

    expect(cache.handleRequest).toHaveBeenCalledTimes(0);
  });

  test('handleNavigation denyList overrides allowList', async () => {
    const allowList = [/^\/home$/];
    const denyList = [/^\/$/];
    const navigationHandler = new NavigationHandler({
      cache,
      allowList,
      denyList,
    });

    const event = {
      data: {
        payload: {
          type: 'REMIX_NAVIGATION',
          location: {
            pathname: '/home',
            search: '',
            hash: '',
          },
          isSsr: true,
        },
      },
    } as any;

    await navigationHandler.handleMessage(event);

    expect(cache.handleRequest).toHaveBeenCalledTimes(0);
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
