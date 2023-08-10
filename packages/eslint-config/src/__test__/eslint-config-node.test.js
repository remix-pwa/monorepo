import eslint from 'eslint';
import { expect, expectTypeOf, test } from 'vitest';

import config from '../eslint-config-node.cjs';

test('should have basic properties of an eslint config', () => {
  expectTypeOf(config.parserOptions).toBeObject();
  expectTypeOf(config.env).toBeObject();
  expectTypeOf(config.rules).toBeObject();
  expectTypeOf(config.plugins).toBeArray();
});

test('should be able to lint source code using the eslint config', async () => {
  const cli = new eslint.ESLint({
    useEslintrc: false,
    baseConfig: config,
  });

  const code = 'const foo = 1;\nconst bar = () => {};\nbar(foo);\n';
  const result = await cli.lintText(code);

  expect(result[0].errorCount).toBe(0);
});
