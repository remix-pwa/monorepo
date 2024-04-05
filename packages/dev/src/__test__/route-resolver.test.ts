import { afterAll, assert, assertType, beforeAll, describe, expect, test, vi } from 'vitest';

vi.doMock('@babel/core', () => {
  return {
    parse: vi.fn().mockReturnValue({
      program: {
        body: [],
      },
    }),
    traverse: vi.fn(),
    types: {
      isVariableDeclarator: vi.fn(),
      isIdentifier: vi.fn(),
      isFunctionDeclaration: vi.fn(),
      isArrowFunctionExpression: vi.fn(),
    },
  };
});
vi.doMock('@babel/traverse', () => {
  return {
    default: vi.fn(),
  };
});

describe('Worker Route AST parser/resolver', () => {
  beforeAll(() => {
    vi.doMock('../babel.js', () => {
      return {
        traverse: vi.fn(),
        t: {
          isVariableDeclarator: vi.fn(),
          isIdentifier: vi.fn(),
          isFunctionDeclaration: vi.fn(),
          isArrowFunctionExpression: vi.fn(),
        },
      };
    });
    vi.doMock('../resolve-route-modules.js', () => {
      return {
        resolveRouteModules: vi.fn().mockReturnValueOnce({
          hasLoader: false,
          hasAction: false,
          hasWorkerLoader: false,
          hasWorkerAction: false,
        }),
      };
    });
  });

  test('should return default false object is no route module/worker apis are found', async () => {
    const { resolveRouteModules } = await import('../resolve-route-modules.js');

    const resolvedRoute = resolveRouteModules({
      type: 'File',
      errors: [],
      program: {
        type: 'Program',
        directives: [],
        sourceType: 'module',
        body: [],
      },
    });

    assertType<object>(resolvedRoute);
    expect(resolvedRoute).toBeTypeOf('object');

    expect(resolvedRoute).toEqual({
      hasLoader: false,
      hasAction: false,
      hasWorkerAction: false,
      hasWorkerLoader: false,
    });
  });

  afterAll(() => {
    vi.doUnmock('@babel/traverse');
    vi.doUnmock('@babel/core');
    vi.doUnmock('../babel.js');
    vi.doUnmock('../resolve-route-modules.js');
    vi.clearAllMocks();
  });
});
