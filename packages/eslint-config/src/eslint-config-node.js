'use strict';

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:import/errors',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    impliedStrict: true,
  },
  plugins: ['@typescript-eslint', 'import', 'disable', 'jsdoc', 'sort-destructure-keys', 'node'],
  env: {
    node: true,
    jest: true,
  },
  processor: 'disable/disable',
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/ban-ts-comment': 'off',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
      },
    ],
    strict: 'error',
    'sort-destructure-keys/sort-destructure-keys': 'error',
    'import/no-unresolved': [2, { caseSensitive: false }],
    '@typescript-eslint/no-explicit-any': 'off',
  },
  overrides: [
    {
      files: ['**/*.test.ts'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
      },
    },
  ],
};
