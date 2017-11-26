import {
  BLANK_LINE_REGEX,
  SECTION_START_REGEX,
  ATTRIBUTE_NAME_REGEX
} from './utils'
import parseHeadline from './headline'
import parseSection from './section'
import parseAttribute from './attribute'

export function parse (string = '') {
  // normalize linebreaks to \n.
  string = string.replace(/\r?\n|\r/g, '\n')

  const ast = {
    type: 'insight',
    nodes: []
  }

  const lines = string.split(/\n/g)

  const headlineNode = parseHeadline(lines, 0)
  ast.nodes.push(headlineNode)

  for (let i = headlineNode.position.end.line + 1; i < lines.length; i++) {
    const line = lines[i]

    if (BLANK_LINE_REGEX.test(line)) {
      continue
    }

    if (SECTION_START_REGEX.test(line)) {
      const node = parseSection(lines, i)
      ast.nodes.push(node)
      i = node.position.end.line
      continue
    }

    if (ATTRIBUTE_NAME_REGEX.test(line)) {
      const node = parseAttribute(lines, i)
      ast.nodes.push(node)
      i = node.position.end.line
      continue
    }

    throw new SyntaxError(`Invalid token on line ${i}: ${line}`)
  }

  return ast
}

export function astToInsight (ast) {
  return ast.nodes.reduce((prev, n) => {
    prev[n.name] = n.content
    return prev
  }, {})
}
