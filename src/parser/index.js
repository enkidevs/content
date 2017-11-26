import traverse from 'traverse'
import {
  BLANK_LINE_REGEX,
  SECTION_START_REGEX,
  ATTRIBUTE_NAME_REGEX,
  QUESTION_GAP_REGEX
} from './utils'
import parseHeadline from './headline'
import parseSection from './section'
import parseAttribute from './attribute'

export default function parse (string = '') {
  // normalize linebreaks to \n.
  string = string.replace(/\r?\n|\r/g, '\n')

  const ast = {
    type: 'insight',
    nodes: []
  }

  const lines = string.split(/\n/g)

  const headlineNode = parseHeadline(lines, 0)
  ast.nodes.push(headlineNode)

  for (let i = headlineNode.end.line + 1; i < lines.length; i++) {
    const line = lines[i]

    if (BLANK_LINE_REGEX.test(line)) {
      continue
    }

    if (SECTION_START_REGEX.test(line)) {
      const node = parseSection(lines, i)
      ast.nodes.push(node)
      i = node.end.line
      continue
    }

    if (ATTRIBUTE_NAME_REGEX.test(line)) {
      const node = parseAttribute(lines, i)
      ast.nodes.push(node)
      i = node.end.line
      continue
    }

    throw new SyntaxError(`Invalid token on line ${i}: ${line}`)
  }

  traverse(ast).forEach(function iter (node) {
    if (node.type === 'code') {
      // TODO: format code
    } else if (node.type === 'text') {
      // TODO: spellcheck text
    }
  })

  return ast
}

export function astToInsight (ast) {
  return ast.nodes.reduce((prev, n) => {
    prev[n.name] = n.content
    return prev
  }, {})
}
