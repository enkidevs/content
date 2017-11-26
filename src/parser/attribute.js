import yaml from 'js-yaml'
import {
  contentLinesToString,
  getContentBoundaries,
  getMarkdownLink,
  ATTRIBUTE_NAME_REGEX,
  SECTION_START_REGEX,
  TYPES
} from './utils'
import createNode from './create-node'

export default function parseAttribute (lines, attrNameLineNum) {
  const attrNameLine = lines[attrNameLineNum]
  const [, name] = attrNameLine.match(ATTRIBUTE_NAME_REGEX)

  const attrName = `${name}:`
  const attrNameLineValue = attrNameLine.replace(ATTRIBUTE_NAME_REGEX, '')

  const attributeEndConditions = line => {
    return ATTRIBUTE_NAME_REGEX.test(line) || SECTION_START_REGEX.test(line)
  }

  let { contentLines, startLineNum, endLineNum } = getContentBoundaries(
    lines,
    attrNameLineNum,
    attributeEndConditions
  )

  // if the first line contains the attribute value, include it
  let startColNum
  if (attrName.length < attrNameLine.length) {
    startLineNum = attrNameLineNum
    startColNum = attrNameLine.length - attrNameLineValue.trimLeft().length
  } else {
    startColNum =
      lines[startLineNum].length - lines[startLineNum].trimLeft().length
  }

  const yamlString = contentLinesToString([
    attrName,
    attrNameLineValue,
    ...contentLines
  ])
  const parsedValue = yaml.safeLoad(yamlString) || {}

  return createNode({
    lines,
    name,
    type: TYPES.ATTRIBUTE,
    startLineNum,
    startColNum,
    endLineNum,
    value:
      name === 'links' && Array.isArray(parsedValue[name])
        ? parsedValue[name].map(getMarkdownLink)
        : parsedValue[name]
  })
}
