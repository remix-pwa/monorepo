import type { Node } from 'acorn'
import { parse } from 'acorn'


export function addExport(
  tree: { children: { type: string; value: any; data: { estree: Node } }[] },
  name: any,
  value: string
) {
  value = `export const ${name} = ${JSON.stringify(value)}`
  tree.children.push({
    type: 'mdxjsEsm',
    value,
    data: {
      estree: parse(value, { ecmaVersion: 'latest', sourceType: 'module' }),
    },
  })
}
