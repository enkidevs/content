import { TYPES, parseMarkdownLines } from '../utils'
import createNode from '../create-node'

export default function parseQuestion (lines, startLineNum, endLineNum) {
  return createNode({
    lines,
    type: TYPES.SECTION,
    startLineNum,
    endLineNum,
    nodes: parseMarkdownLines(lines, startLineNum, endLineNum).children
  })
}
