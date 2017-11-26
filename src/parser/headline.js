import { HEADLINE_REGEX, skipBlankLines, TYPES } from './utils'
import createNode from './create-node'

export default function parseHeadline (lines, lineNum) {
  const headlineLineNum = skipBlankLines(lines, 0)
  if (!HEADLINE_REGEX.test(lines[headlineLineNum])) {
    throw new SyntaxError(
      `Invalid headline on line ${headlineLineNum}: ${lines[headlineLineNum]}`
    )
  }

  const [, headline] = lines[headlineLineNum].match(HEADLINE_REGEX)

  return createNode({
    lines,
    name: 'headline',
    type: TYPES.HEADLINE,
    startLineNum: lineNum,
    endLineNum: lineNum,
    content: headline
  })
}
