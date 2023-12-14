import type { types as BabelTypes } from '@babel/core';
import generate from '@babel/generator';
import { parse } from '@babel/parser';
import type { NodePath } from '@babel/traverse';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

export { generate, parse, t, traverse };
export type { BabelTypes, NodePath };
