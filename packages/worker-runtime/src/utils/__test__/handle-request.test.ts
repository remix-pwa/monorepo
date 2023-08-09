import { describe, expect, test, vi } from 'vitest';
import type { WorkerLoadContext, WorkerRoute } from '@remix-pwa/dev/worker-build.js';

import { handleRequest } from '../handle-request.js';

describe('handleRequest', () => {
  test('should handle loader requests', async () => {
    const routes = [
      {
        id: 'route1',
        module: {
          workerLoader: vi.fn(() => Promise.resolve({ message: 'Hello, world!' })),
        },
      } as unknown as WorkerRoute,
    ];
    const event = {
      request: new Request('https://example.com/route1?_data=route1'),
    } as FetchEvent;
    const defaultHandler = vi.fn(() => new Response('Default handler response'));
    const errorHandler = vi.fn(() => new Response('Error handler response'));
    const loadContext = {} as WorkerLoadContext;
    const response = await handleRequest({ routes, event, defaultHandler, errorHandler, loadContext });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ message: 'Hello, world!' });
  });

  test('should handle action requests', async () => {
    const routes = [
      {
        id: 'route1',
        module: {
          workerAction: vi.fn(() => Promise.resolve({ message: 'Hello, world!' })),
        },
      } as unknown as WorkerRoute,
    ];
    const event = {
      request: new Request('https://example.com/route1?_data=route1&action=true', { method: 'POST' }),
    } as FetchEvent;
    const defaultHandler = vi.fn(() => new Response('Default handler response'));
    const errorHandler = vi.fn(() => new Response('Error handler response'));
    const loadContext = {} as WorkerLoadContext;
    const response = await handleRequest({ routes, event, defaultHandler, errorHandler, loadContext });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ message: 'Hello, world!' });
  });

  test('should call the default handler for non-loader and non-action requests', async () => {
    const routes = [] as Array<WorkerRoute>;
    const event = {
      request: new Request('https://example.com/route2'),
    } as FetchEvent;
    const defaultHandler = vi.fn(() => new Response('Default handler response'));
    const errorHandler = vi.fn(() => new Response('Error handler response'));
    const loadContext = {} as WorkerLoadContext;

    const response = await handleRequest({ routes, event, defaultHandler, errorHandler, loadContext });

    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe('Default handler response');
    expect(defaultHandler).toHaveBeenCalledTimes(1);
    expect(defaultHandler).toHaveBeenCalledWith({
      request: event.request,
      params: {},
      context: loadContext,
    });
  });

  test('should call the error handler for errors', async () => {
    const error = new Error('Test error');
    const handler = vi.fn();
    const routes = [
      {
        id: 'route1',
        module: {
          workerLoader: vi.fn(() => Promise.reject(error)),
        },
      } as unknown as WorkerRoute,
    ];
    const event = {
      request: new Request('https://example.com/route1?_data=route1'),
    } as FetchEvent;
    const defaultHandler = vi.fn(() => new Response('Default handler response'));
    const loadContext = {} as WorkerLoadContext;
    const response = await handleRequest({ routes, event, defaultHandler, errorHandler: handler, loadContext });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(error, {
      params: {},
      request: expect.any(Request),
      context: loadContext,
    });
    expect(response.status).toBe(500);
  });
});
