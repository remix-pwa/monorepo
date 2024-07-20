'use strict';

/** @type {import('eslint').Linter.Config} */
module.exports = {
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  env: {
    es6: true,
    node: true,
  },
  rules: {
    'no-unused-vars': 'error',
    'no-undef': 'error',
  },
};
