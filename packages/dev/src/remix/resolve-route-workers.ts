import MagicString from 'magic-string';

import { t, traverse, type ParseResult } from './babel.js';

export const resolveRouteWorkerApis = ({ ast, source }: { ast: ParseResult; source: string }): string => {
  // Includes the external imports that are used within the workerLoader function
  const targetFunctionIdentifiers: string[] = [];
  // A simple map of imports and their source
  const targetFunctionImports: Record<string, string> = {};
  // The final code of the route
  const targetFunctionCode = new MagicString('');

  traverse(ast, {
    FunctionDeclaration(path) {
      const functionName = path.node.id?.name;

      if (functionName === 'workerLoader' || functionName === 'workerAction') {
        // Analyze the function's body for identifiers
        path.traverse({
          Identifier(identifierPath) {
            const identifierName = identifierPath.node.name;
            if (!targetFunctionIdentifiers.includes(identifierName)) {
              targetFunctionIdentifiers.push(identifierName);
            }
          },
        });

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        targetFunctionCode.append(`export ${source.substring(path.node.start!, path.node.end!)}\n`);
      }
    },
    ArrowFunctionExpression(path) {
      // Ensure the arrow function isn't an anonymous function and is a variable declarator
      if (t.isVariableDeclarator(path.parent) && t.isIdentifier(path.parent.id)) {
        const functionName = path.parent.id.name;

        if (functionName === 'workerLoader' || functionName === 'workerAction') {
          // Analyze the arrow function's body for identifiers
          path.traverse({
            Identifier(identifierPath) {
              const identifierName = identifierPath.node.name;
              if (!targetFunctionIdentifiers.includes(identifierName)) {
                targetFunctionIdentifiers.push(identifierName);
              }
            },
          });

          targetFunctionCode.append(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            `export const ${functionName.trim()} = ${source.substring(path.node.start!, path.node.end!)}\n`
          );
        }
      }
    },
  });

  // If there are no target function identifiers, then there's no need to continue
  if (targetFunctionCode.toString().length === 0) {
    return 'module.exports = {};';
  }

  // Build import statements based on identified identifiers
  traverse(ast, {
    ImportDeclaration(path) {
      const importSpecifiers = path.node.specifiers
        .filter(
          specifier => specifier.type === 'ImportSpecifier' && targetFunctionIdentifiers.includes(specifier.local.name)
        )
        .map(specifier => specifier.local.name);

      if (importSpecifiers.length > 0) {
        importSpecifiers.forEach(specifier => {
          targetFunctionImports[specifier] = path.node.source.value;
        });
      }
    },
  });

  targetFunctionCode.prepend(
    `${Object.keys(targetFunctionImports)
      .map(key => `import { ${key} } from '${targetFunctionImports[key]}';`)
      .join('\n')}\n`
  );

  return targetFunctionCode.toString();
};
