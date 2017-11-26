import { TYPES, NAMES, parseMarkdownLines } from '../utils'
import createNode from '../create-node'

export default function parseQuestion (lines, startLineNum, endLineNum) {
  return createNode({
    lines,
    name: NAMES.FOOTNOTES,
    type: TYPES.SECTION,
    startLineNum,
    endLineNum,
    nodes: parseMarkdownLines(lines, startLineNum, endLineNum).children[0]
      .children
  })
}
