import remark from 'remark'

export default function parseContent (lines, startLineNum, endLineNum) {
  return remark.parse(lines.slice(startLineNum, endLineNum + 1)).children
}
