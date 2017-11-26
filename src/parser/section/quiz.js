import yaml from 'js-yaml'
import { getMarkdownLink } from '../utils';

export default function parseQuiz (lines, startLineNum, endLineNum) {
  const data = yaml.safeLoad(lines.slice(startLineNum, endLineNum + 1))
  const nodes = Object.keys(data).map(name => (
    createNode({
      lines,
      name,
      type: TYPES.ATTRIBUTE,
      startLineNum,
      startColNum,
      endLineNum,
      content:
        name === 'links' && Array.isArray(data[name])
          ? data[name].map(getMarkdownLink)
          : data[name]
    })
  );
}
