/* eslint-disable no-void */
/* eslint-disable dot-notation */
import { describe, expect, test, vi } from 'vitest';

import { NavigationHandler } from '../NavigationHandler';

describe('NavigationHandler testing Suite', () => {
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
    const cache = {
      handleRequest: vi.fn().mockResolvedValue(void 0),
    } as any;
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
        },
      },
    } as any;

    await navigationHandler.handleMessage(event);

    expect(cache.handleRequest).toHaveBeenCalledTimes(1);
    expect(cache.handleRequest).toHaveBeenCalledWith('/');
  });

  test('handleNavigation correctly handles navigation event with allowList', async () => {
    const cache = {
      handleRequest: vi.fn().mockResolvedValue(void 0),
    } as any;
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
        },
      },
    } as any;

    await navigationHandler.handleMessage(event);

    expect(cache.handleRequest).toHaveBeenCalledTimes(0);
  });

  test("handleNavigation correctly handles navigation event with denyList (doesn't handle it)", async () => {
    const cache = {
      handleRequest: vi.fn().mockResolvedValue(void 0),
    } as any;
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
        },
      },
    } as any;

    await navigationHandler.handleMessage(event);

    expect(cache.handleRequest).toHaveBeenCalledTimes(0);
  });

  test('handleNavigation denyList overrides allowList', async () => {
    const cache = {
      handleRequest: vi.fn().mockResolvedValue(void 0),
    } as any;
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
        },
      },
    } as any;

    await navigationHandler.handleMessage(event);

    expect(cache.handleRequest).toHaveBeenCalledTimes(0);
  });
});
