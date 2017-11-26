import parseAttribute from '../attribute'
import { NAMES, TYPES, BLANK_LINE_REGEX, ATTRIBUTE_NAME_REGEX } from '../utils'
import createNode from '../create-node'

export default function parseQuiz (lines, startLineNum, endLineNum) {
  const nodes = []
  for (let i = startLineNum; i <= endLineNum; i++) {
    const line = lines[i]

    if (BLANK_LINE_REGEX.test(line)) {
      continue
    }

    if (ATTRIBUTE_NAME_REGEX.test(line)) {
      const node = parseAttribute(lines, i)
      nodes.push(node)
      i = node.position.end.line
      continue
    }

    throw new SyntaxError(`Invalid token on line ${i}: ${line}`)
  }

  return createNode({
    lines,
    name: NAMES.QUIZ,
    type: TYPES.SECTION,
    startLineNum,
    endLineNum,
    nodes
  })
}
