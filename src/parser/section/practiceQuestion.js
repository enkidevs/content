import remark from 'remark'

export default function parsePracticeQuestion (lines, startLineNum, endLineNum) {
  return createNode({
    remark.parse(lines.slice(startLineNum, endLineNum + 1)).children
  })
}
