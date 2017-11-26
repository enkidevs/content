import remark from 'remark'

export default function parseReviseQuestion (lines, startLineNum, endLineNum) {
  return remark.parse(lines.slice(startLineNum, endLineNum + 1)).children
}
