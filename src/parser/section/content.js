import { TYPES, NAMES, parseMarkdownLines } from '../utils'
import createNode from '../create-node'

export default function parseContent (lines, startLineNum, endLineNum) {
  return createNode({
    lines,
    name: NAMES.CONTENT,
    type: TYPES.SECTION,
    startLineNum,
    endLineNum,
    nodes: parseMarkdownLines(lines, startLineNum, endLineNum).children
  })
}
