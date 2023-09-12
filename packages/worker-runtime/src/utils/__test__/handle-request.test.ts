import type { WorkerLoadContext, WorkerRoute, WorkerRouteManifest } from '@remix-pwa/dev/worker-build.js';
import { defer } from '@remix-run/router';
import { describe, expect, test, vi } from 'vitest';

import { handleRequest } from '../handle-request.js';

describe('handleRequest', () => {
  test('should handle loader requests', async () => {
    const routes = {
      route1: {
        id: 'route1',
        module: {
          workerLoader: vi.fn(() => Promise.resolve({ message: 'Hello, world!' })),
        },
      } as unknown as WorkerRoute,
    };
    const event = {
      request: new Request('https://example.com/route1?_data=route1'),
    } as FetchEvent;
    const defaultHandler = vi.fn();
    const errorHandler = vi.fn();
    const loadContext = {} as WorkerLoadContext;
    const response = await handleRequest({ routes, event, defaultHandler, errorHandler, loadContext });

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json; charset=utf-8');
    await expect(response.json()).resolves.toEqual({ message: 'Hello, world!' });
  });

  test('should not wrap worker loader response in a json when returning a response', async () => {
    const routes = {
      route1: {
        id: 'route1',
        module: {
          workerLoader: vi.fn().mockReturnValue(new Response('mock-response', { status: 200 })),
        },
      } as unknown as WorkerRoute,
    };
    const event = {
      request: new Request('https://example.com/route1?_data=route1'),
    } as FetchEvent;
    const defaultHandler = vi.fn();
    const errorHandler = vi.fn();
    const loadContext = {} as WorkerLoadContext;
    const response = await handleRequest({ routes, event, defaultHandler, errorHandler, loadContext });

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).not.toBe('application/json; charset=utf-8');
    expect(await response.text()).toBe('mock-response');
  });

  test('should handle action requests', async () => {
    const routes = {
      route1: {
        id: 'route1',
        module: {
          workerAction: vi.fn(() => Promise.resolve({ message: 'Hello, world!' })),
        },
      } as unknown as WorkerRoute,
    };
    const event = {
      request: new Request('https://example.com/route1?_data=route1&action=true', { method: 'POST' }),
    } as FetchEvent;
    const defaultHandler = vi.fn();
    const errorHandler = vi.fn();
    const loadContext = {} as WorkerLoadContext;
    const response = await handleRequest({ routes, event, defaultHandler, errorHandler, loadContext });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ message: 'Hello, world!' });
  });

  test('should call the default handler for non-loader and non-action requests', async () => {
    const routes = {} as WorkerRouteManifest;
    const event = {
      request: new Request('https://example.com/route2'),
    } as FetchEvent;
    const defaultHandler = vi.fn(() => new Response('Default handler response'));
    const errorHandler = vi.fn();
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
    const routes = {
      route1: {
        id: 'route1',
        module: {
          workerLoader: vi.fn(() => Promise.reject(error)),
        },
      } as unknown as WorkerRoute,
    };
    const event = {
      request: new Request('https://example.com/route1?_data=route1'),
    } as FetchEvent;
    const defaultHandler = vi.fn();
    const loadContext = {} as WorkerLoadContext;
    const response = await handleRequest({ routes, event, defaultHandler, errorHandler: handler, loadContext });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(error, {
      params: {
        _data: 'route1',
      },
      request: event.request,
      context: loadContext,
    });
    expect(response.status).toBe(500);
  });

  test('should return a 204 and add Remix Headers on a redirect response', async () => {
    const routes = {
      route1: {
        id: 'route1',
        module: {
          workerAction: vi.fn().mockReturnValue(new Response(null, { status: 302, headers: { Location: '/route2' } })),
        },
      } as unknown as WorkerRoute,
    };
    const event = {
      request: new Request('https://example.com/route1?_data=route1&action=true', { method: 'POST' }),
    } as FetchEvent;
    const defaultHandler = vi.fn();
    const errorHandler = vi.fn();
    const loadContext = {} as WorkerLoadContext;
    const response = await handleRequest({ routes, event, defaultHandler, errorHandler, loadContext });
    expect(response.status).toBe(204);
    expect(Object.fromEntries(response.headers.entries())).toEqual({
      'x-remix-redirect': '/route2',
      'x-remix-status': '302',
    });
  });

  test('should force a revalidate on redirect', async () => {
    const routes = {
      route1: {
        id: 'route1',
        module: {
          workerAction: vi
            .fn()
            .mockReturnValue(
              new Response(null, { status: 302, headers: { Location: '/route2', 'Set-Cookie': 'mock-cookie-value' } })
            ),
        },
      } as unknown as WorkerRoute,
    };
    const event = {
      request: new Request('https://example.com/route1?_data=route1&action=true', { method: 'POST' }),
    } as FetchEvent;
    const defaultHandler = vi.fn();
    const errorHandler = vi.fn();
    const loadContext = {} as WorkerLoadContext;
    const response = await handleRequest({ routes, event, defaultHandler, errorHandler, loadContext });
    expect(response.status).toBe(204);
    expect(Object.fromEntries(response.headers.entries())).toEqual({
      'x-remix-redirect': '/route2',
      'x-remix-status': '302',
      'x-remix-revalidate': 'yes',
      'set-cookie': 'mock-cookie-value',
    });
  });

  test('should mark the response as a Remix Response', async () => {
    const routes = {
      route1: {
        id: 'route1',
        module: {
          workerAction: vi.fn().mockReturnValue(new Response('Remix response', { status: 200 })),
        },
      } as unknown as WorkerRoute,
    };
    const event = {
      request: new Request('https://example.com/route1?_data=route1&action=true', { method: 'POST' }),
    } as FetchEvent;
    const defaultHandler = vi.fn();
    const errorHandler = vi.fn();
    const loadContext = {} as WorkerLoadContext;
    const response = await handleRequest({ routes, event, defaultHandler, errorHandler, loadContext });
    expect(response.status).toBe(200);
    expect(Object.fromEntries(response.headers.entries())).toEqual({
      'content-type': 'text/plain;charset=UTF-8',
      'x-remix-response': 'yes',
    });
  });

  test('should call a worker action with search params', async () => {
    const mockWorkerAction = vi.fn().mockReturnValue(new Response('Remix response', { status: 200 }));
    const routes = {
      route1: {
        id: 'route1',
        module: {
          workerAction: mockWorkerAction,
        },
      } as unknown as WorkerRoute,
    };
    const event = {
      request: new Request('https://example.com/route1?_data=route1&query=this is a test', { method: 'POST' }),
    } as FetchEvent;
    const defaultHandler = vi.fn();
    const errorHandler = vi.fn();
    const loadContext = {} as WorkerLoadContext;
    await handleRequest({ routes, event, defaultHandler, errorHandler, loadContext });

    expect(mockWorkerAction).toHaveBeenCalledWith({
      request: expect.anything(),
      params: { query: 'this is a test' },
      context: loadContext,
    });
  });

  test('should call a worker action with path params', async () => {
    const mockWorkerAction = vi.fn().mockReturnValue(new Response('Remix response', { status: 200 }));
    const routes = {
      route1: {
        id: 'route1',
        module: {
          workerAction: mockWorkerAction,
        },
        path: '/route1/:id',
      } as unknown as WorkerRoute,
    };
    const event = {
      request: new Request('https://example.com/route1/route-id?_data=route1', { method: 'POST' }),
    } as FetchEvent;
    const defaultHandler = vi.fn();
    const errorHandler = vi.fn();
    const loadContext = {} as WorkerLoadContext;
    await handleRequest({ routes, event, defaultHandler, errorHandler, loadContext });

    expect(mockWorkerAction).toHaveBeenCalledWith({
      request: expect.anything(),
      params: { id: 'route-id' },
      context: loadContext,
    });
  });

  test('should be able to consume given request in a worker action', async () => {
    const mockWorkerAction = vi.fn(async ({ request }) => {
      const text = await request.text();
      throw new Error(text);
    });
    const routes = {
      route1: {
        id: 'route1',
        module: {
          workerAction: mockWorkerAction,
        },
      } as unknown as WorkerRoute,
    };
    const event = {
      request: new Request('https://example.com/route1?_data=route1', { method: 'POST', body: 'mock-error' }),
    } as FetchEvent;
    const defaultHandler = vi.fn();
    const errorHandler = vi.fn();
    const loadContext = {} as WorkerLoadContext;
    const response = await handleRequest({ routes, event, defaultHandler, errorHandler, loadContext });

    expect(mockWorkerAction).toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalled();
    expect(response.headers.get('content-type')).toBe('application/json; charset=utf-8');
    expect(response.headers.get('x-remix-error')).toBe('yes');
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ message: 'mock-error' });
  });

  test('should be able to consume the original request in a worker action', async () => {
    const mockWorkerAction = vi.fn(async ({ context }) => {
      const text = await context.event.request.text();
      throw new Error(text);
    });
    const routes = {
      route1: {
        id: 'route1',
        module: {
          workerAction: mockWorkerAction,
        },
      } as unknown as WorkerRoute,
    };
    const event = {
      request: new Request('https://example.com/route1?_data=route1', { method: 'POST', body: 'mock-error-original' }),
    } as FetchEvent;
    const defaultHandler = vi.fn();
    const errorHandler = vi.fn();
    const loadContext = { event } as WorkerLoadContext;
    const response = await handleRequest({ routes, event, defaultHandler, errorHandler, loadContext });

    expect(mockWorkerAction).toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalledWith(expect.any(Error), {
      context: loadContext,
      request: event.request,
      params: {
        _data: 'route1',
      },
    });
    expect(response.headers.get('content-type')).toBe('application/json; charset=utf-8');
    expect(response.headers.get('x-remix-error')).toBe('yes');
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ message: 'mock-error-original' });
  });

  test('should be able to throw a RouteErrorResponse and not call the error handler', async () => {
    const mockWorkerAction = vi.fn(async ({ request }) => {
      const text = await request.text();
      const errorResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        internal: true,
        data: {
          message: text,
        },
      };
      throw errorResponse;
    });
    const routes = {
      route1: {
        id: 'route1',
        module: {
          workerAction: mockWorkerAction,
        },
      } as unknown as WorkerRoute,
    };
    const event = {
      request: new Request('https://example.com/route1?_data=route1', { method: 'POST', body: 'mock-error-original' }),
    } as FetchEvent;
    const defaultHandler = vi.fn();
    const errorHandler = vi.fn();
    const loadContext = { event } as WorkerLoadContext;
    const response = await handleRequest({ routes, event, defaultHandler, errorHandler, loadContext });

    expect(mockWorkerAction).toHaveBeenCalled();
    expect(errorHandler).not.toHaveBeenCalled();
    expect(response.headers.get('content-type')).toBe('application/json; charset=utf-8');
    expect(response.headers.get('x-remix-error')).toBe('yes');
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ message: 'Unexpected Server Error' });
  });

  test('should be able to throw a RouteErrorResponse and pass the error to the error handler', async () => {
    const mockWorkerAction = vi.fn(async ({ request }) => {
      const text = await request.text();
      const errorResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        internal: true,
        data: {
          message: text,
        },
        error: new Error('Internal server error'),
      };
      throw errorResponse;
    });
    const routes = {
      route1: {
        id: 'route1',
        module: {
          workerAction: mockWorkerAction,
        },
      } as unknown as WorkerRoute,
    };
    const event = {
      request: new Request('https://example.com/route1?_data=route1', { method: 'POST', body: 'mock-error-original' }),
    } as FetchEvent;
    const defaultHandler = vi.fn();
    const errorHandler = vi.fn();
    const loadContext = { event } as WorkerLoadContext;
    const response = await handleRequest({ routes, event, defaultHandler, errorHandler, loadContext });

    expect(mockWorkerAction).toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalled();

    expect(response.headers.get('content-type')).toBe('application/json; charset=utf-8');
    expect(response.headers.get('x-remix-error')).toBe('yes');
    expect(response.status).toBe(500);
  });

  test('should not call the error handler when throwing a response', async () => {
    const mockWorkerAction = vi.fn(async () => {
      throw new Response('Response error', { status: 500 });
    });
    const routes = {
      route1: {
        id: 'route1',
        module: {
          workerAction: mockWorkerAction,
        },
      } as unknown as WorkerRoute,
    };
    const event = {
      request: new Request('https://example.com/route1?_data=route1', { method: 'POST', body: 'mock-body' }),
    } as FetchEvent;
    const defaultHandler = vi.fn();
    const errorHandler = vi.fn();
    const loadContext = {} as WorkerLoadContext;
    const response = await handleRequest({ routes, event, defaultHandler, errorHandler, loadContext });

    expect(mockWorkerAction).toHaveBeenCalled();
    expect(errorHandler).not.toHaveBeenCalled();
    expect(response.headers.get('x-remix-catch')).toBe('yes');
    await expect(response.text()).resolves.toBe('Response error');
  });

  test('should handle stream data in a worker loader with a redirect', async () => {
    const mockWorkerLoader = vi
      .fn()
      .mockReturnValue(
        defer({ promise: Promise.resolve('mock-promise') }, { status: 302, headers: { Location: '/route2' } })
      );
    const routes = {
      route1: {
        id: 'route1',
        module: {
          workerLoader: mockWorkerLoader,
        },
      } as unknown as WorkerRoute,
    };
    const event = {
      request: new Request('https://example.com/route1?_data=route1', { method: 'GET' }),
    } as FetchEvent;
    const defaultHandler = vi.fn();
    const errorHandler = vi.fn();
    const loadContext = {} as WorkerLoadContext;
    const response = await handleRequest({ routes, event, defaultHandler, errorHandler, loadContext });

    expect(mockWorkerLoader).toHaveBeenCalled();
    expect(Object.fromEntries(response.headers.entries())).toEqual({
      'x-remix-redirect': '/route2',
      'x-remix-status': '302',
    });
    expect(response.status).toBe(204);
  });

  test('should handle stream data in a worker loader', async () => {
    const mockWorkerLoader = vi.fn().mockReturnValue(defer({ promise: Promise.resolve('mock-promise') }, undefined));
    const routes = {
      route1: {
        id: 'route1',
        module: {
          workerLoader: mockWorkerLoader,
        },
      } as unknown as WorkerRoute,
    };
    const event = {
      request: new Request('https://example.com/route1?_data=route1', { method: 'GET' }),
    } as FetchEvent;
    const defaultHandler = vi.fn();
    const errorHandler = vi.fn();
    const loadContext = {} as WorkerLoadContext;
    const response = await handleRequest({ routes, event, defaultHandler, errorHandler, loadContext });

    expect(mockWorkerLoader).toHaveBeenCalled();
    expect(Object.fromEntries(response.headers.entries())).toEqual({
      'content-type': 'text/remix-deferred',
      'x-remix-response': 'yes',
    });
    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toContain('mock-promise');
  });

  test('should handle stream data in a worker loader and use the given response init', async () => {
    const mockWorkerLoader = vi
      .fn()
      .mockReturnValue(
        defer(
          { promise: Promise.resolve('mock-promise') },
          { status: 500, headers: { 'x-mock-header': 'mock-header-value' } }
        )
      );
    const routes = {
      route1: {
        id: 'route1',
        module: {
          workerLoader: mockWorkerLoader,
        },
      } as unknown as WorkerRoute,
    };
    const event = {
      request: new Request('https://example.com/route1?_data=route1', { method: 'GET' }),
    } as FetchEvent;
    const defaultHandler = vi.fn();
    const errorHandler = vi.fn();
    const loadContext = {} as WorkerLoadContext;
    const response = await handleRequest({ routes, event, defaultHandler, errorHandler, loadContext });

    expect(mockWorkerLoader).toHaveBeenCalled();
    expect(Object.fromEntries(response.headers.entries())).toEqual({
      'content-type': 'text/remix-deferred',
      'x-remix-response': 'yes',
      'x-mock-header': 'mock-header-value',
    });
    expect(response.status).toBe(500);
    await expect(response.text()).resolves.toContain('mock-promise');
  });
});
