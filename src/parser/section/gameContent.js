import { TYPES, NAMES, parseMarkdownLines } from '../utils'
import createNode from '../create-node'

export default function parseGameContent (lines, startLineNum, endLineNum) {
  return createNode({
    lines,
    name: NAMES.GAME_CONTENT,
    type: TYPES.SECTION,
    startLineNum,
    endLineNum,
    nodes: parseMarkdownLines(lines, startLineNum, endLineNum).children
  })
}
