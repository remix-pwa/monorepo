import type { types as BabelTypes, ParseResult } from '@babel/core';
import _generate from '@babel/generator';
import { parse } from '@babel/parser';
import type { NodePath } from '@babel/traverse';
import _traverse from '@babel/traverse';
import * as t from '@babel/types';

// Due to native ESM/CJS issues, we need to import the default export of these
// packages and then re-export them as named exports. Due to the natureof their exports,
// we can't just re-export the default export.
// See: https://github.com/babel/babel/issues/13855#issuecomment-945123514
const generate = _generate.default;
const traverse = _traverse.default;

export { generate, parse, t, traverse };
export type { BabelTypes, NodePath, ParseResult };
