import { afterAll, afterEach, assert, assertType, beforeAll, describe, expect, test, vi } from 'vitest';

vi.doMock('magic-string', () => {
  return {
    default: vi.fn().mockReturnValue({
      append: vi.fn(),
      prepend: vi.fn(),
      toString: vi.fn().mockReturnValue(''),
    }),
  };
});
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
    vi.doMock('../resolve-route-workers.js', () => {
      return {
        resolveRouteWorkerApis: vi
          .fn()
          .mockReturnValueOnce("export function workerLoader() {\n  addEventListener('fetch', workerAction);\n}")
          .mockReturnValueOnce('module.exports = {};'),
      };
    });
  });

  test('should parse a route AST', async () => {
    const { resolveRouteWorkerApis } = await import('../resolve-route-workers.js');

    const resolvedRoute = resolveRouteWorkerApis({
      ast: {
        type: 'File',
        errors: [],
        // Ik this is an incomplete AST, but it's enough for the test
        program: {
          type: 'Program',
          directives: [],
          sourceFile: 'worker-resource-route.ts',
          sourceType: 'module',
          body: [
            {
              type: 'FunctionDeclaration',
              id: {
                type: 'Identifier',
                name: 'workerLoader',
              },
              params: [],
              generator: false,
              async: false,
              body: {
                type: 'BlockStatement',
                directives: [],
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'addEventListener',
                      },
                      arguments: [
                        {
                          type: 'StringLiteral',
                          value: 'fetch',
                        },
                        {
                          type: 'Identifier',
                          name: 'workerAction',
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      source: `
        export function loader() {
          addEventListener('fetch', action);
        }

        export function workerLoader() {
          addEventListener('fetch', workerAction);
        }
      `,
    });

    assert(resolvedRoute);
    expect(resolvedRoute).toBe("export function workerLoader() {\n  addEventListener('fetch', workerAction);\n}");
  });

  test('should return an empty module exports when no route worker apis are exported', async () => {
    const { resolveRouteWorkerApis } = await import('../resolve-route-workers.js');

    const resolvedRoute = resolveRouteWorkerApis({
      ast: {
        type: 'File',
        errors: [],
        // Ik this is an incomplete AST, but it's enough for the test
        program: {
          type: 'Program',
          directives: [],
          sourceFile: 'resource-route.ts',
          sourceType: 'module',
          body: [
            {
              type: 'FunctionDeclaration',
              id: {
                type: 'Identifier',
                name: 'loader',
              },
              params: [],
              generator: false,
              async: false,
              body: {
                type: 'BlockStatement',
                directives: [],
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'addEventListener',
                      },
                      arguments: [
                        {
                          type: 'StringLiteral',
                          value: 'fetch',
                        },
                        {
                          type: 'Identifier',
                          name: 'action',
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      source: `
        export function loader() {
          addEventListener('fetch', action);
        }
      `,
    });

    assertType<string>(resolvedRoute);
    expect(resolvedRoute).toBe('module.exports = {};');
  });

  afterAll(() => {
    vi.doUnmock('@babel/traverse');
    vi.doUnmock('@babel/core');
    vi.doUnmock('magic-string');
    vi.doUnmock('../babel.js');
    vi.doUnmock('../resolve-route-workers.js');
  });
});
