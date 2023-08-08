'use strict';

const eslint = require('eslint');

const config = require('../eslint-config-node.js');

test('should have basic properties of an eslint config', () => {
  expect(config.parserOptions).toBeObject();
  expect(config.env).toBeObject();
  expect(config.rules).toBeObject();
  expect(config.plugins).toBeArray();
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
