export default function createNode ({
  lines,
  name,
  type,
  value,
  startLineNum,
  startColNum = 0,
  endLineNum,
  endColNum = typeof endLineNum === 'number' && lines[endLineNum].length
    ? lines[endLineNum].length - 1
    : 0,
  ...nodeSpecifics
}) {
  return {
    ...nodeSpecifics,
    name,
    type,
    value,
    position: {
      start: {
        line: startLineNum,
        column: startColNum
      },
      end: {
        line: endLineNum,
        column: endColNum
      }
    }
  }
}
