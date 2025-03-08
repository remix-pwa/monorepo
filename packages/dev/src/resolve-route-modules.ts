import { t, traverse, type ParseResult } from './babel.js';

type RouteModules = {
  hasLoader: boolean;
  hasAction: boolean;
  hasClientLoader: boolean;
  hasClientAction: boolean;
  hasWorkerLoader: boolean;
  hasWorkerAction: boolean;
};

export const resolveRouteModules = (ast: ParseResult): RouteModules => {
  const routeModules = {
    hasLoader: false,
    hasAction: false,
    hasClientLoader: false,
    hasClientAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
  };

  traverse(ast, {
    FunctionDeclaration(path) {
      const functionName = path.node.id?.name;

      if (functionName === 'loader') {
        routeModules.hasLoader = true;
      }

      if (functionName === 'action') {
        routeModules.hasAction = true;
      }

      if (functionName === 'clientLoader') {
        routeModules.hasClientLoader = true;
      }

      if (functionName === 'clientAction') {
        routeModules.hasClientAction = true;
      }

      if (functionName === 'workerLoader') {
        routeModules.hasWorkerLoader = true;
      }

      if (functionName === 'workerAction') {
        routeModules.hasWorkerAction = true;
      }
    },
    ArrowFunctionExpression(path) {
      // Ensure the arrow function isn't an anonymous function and is a variable declarator
      if (t.isVariableDeclarator(path.parent) && t.isIdentifier(path.parent.id)) {
        const functionName = path.parent.id.name;

        if (functionName === 'loader') {
          routeModules.hasLoader = true;
        }

        if (functionName === 'action') {
          routeModules.hasAction = true;
        }

        if (functionName === 'clientLoader') {
          routeModules.hasClientLoader = true;
        }

        if (functionName === 'clientAction') {
          routeModules.hasClientAction = true;
        }

        if (functionName === 'workerLoader') {
          routeModules.hasWorkerLoader = true;
        }

        if (functionName === 'workerAction') {
          routeModules.hasWorkerAction = true;
        }
      }
    },
  });

  return routeModules;
};
