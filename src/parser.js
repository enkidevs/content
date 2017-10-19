import yaml from 'js-yaml'
import { sectionTitleToPropMap } from './utils'

// http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string
function getDomainFromURL (url) {
  if (url) {
    let domain
    // find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf('://') > -1) {
      domain = url.split('/')[2]
    } else {
      domain = url.split('/')[0]
    }

    // find & remove port number
    domain = domain.split(':')[0]

    return domain
  }
  return null
}

// https://github.com/chjj/marked/blob/master/lib/marked.js#L455 (slightly hacked with {type})
const mdUrlRegEx = /\[(.*)\]\((.*)\)/
const mdUrlRegExWithType = /\[(.*)\]\((.*)\)\{(.*)\}/

function getMarkdownLink (link) {
  let result
  if (mdUrlRegExWithType.test(link)) {
    result = mdUrlRegExWithType.exec(link)
    return {name: result[1], url: result[2], nature: result[3]}
  }
  if (mdUrlRegEx.test(link)) {
    result = mdUrlRegEx.exec(link)
    return {name: result[1], url: result[2], nature: 'website'}
  }
  console.log('not found', mdUrlRegExWithType.test(link))
  return {
    nature: 'website',
    name: getDomainFromURL(link),
    url: link
  }
}

const HEADLINE_REGEX = /^#\s([^\n]+)/i
const SECTION_START_REGEX = /^-{3}/
const SECTION_TITLE_REGEX = /^##\s([a-z\s*]+)/i
const ATTRIBUTE_NAME_REGEX = /(^[a-z]+):/i
const BLANK_LINE_REGEX = /^\s*$/

const contentLinesToString = (contentArr) => contentArr.join('\n').trim()

function createNode ({
  lines,
  name,
  kind,
  startLineNum,
  startColNum = 0,
  endLineNum,
  endColNum = typeof endLineNum === 'number' && lines[endLineNum].length
    ? lines[endLineNum].length - 1
    : 0,
  value = contentLinesToString(lines.slice(startLineNum, endLineNum + 1))
}) {
  return {
    name,
    kind,
    value,
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

// every node ends when it reaches a new line or EOF
// or if the provided specific end condition function returns `true`
function getContentBoundaries (lines, lineNumBeforeContent, contentSpecificEndCondition = () => false) {
  let startLineNum

  // skip trailing blank lines before the content
  for (let i = lineNumBeforeContent + 1; i < lines.length; i++) {
    const line = lines[i]

    if (BLANK_LINE_REGEX.test(line)) {
      continue
    }

    if (contentSpecificEndCondition(line)) {
      break
    }

    // if we reach something that is not a blank line and
    // not a content ending condition, it's the content start
    startLineNum = i
    break
  }

  // shortcircuit missing content
  if (startLineNum === undefined) {
    return {
      contentLines: [],
      startLineNum: lineNumBeforeContent,
      endLineNum: lineNumBeforeContent
    }
  }

  // content ends when it reaches the end of the file, or
  // content specific end conditions
  let endLineNum = startLineNum
  for (let i = startLineNum; i < lines.length; i++) {
    const line = lines[i]

    if (BLANK_LINE_REGEX.test(lines[i])) {
      continue
    }

    if (contentSpecificEndCondition(line)) {
      break
    }

    // we only remember the last line that had non-blank content
    endLineNum = i
  }

  return {
    contentLines: lines.slice(startLineNum, endLineNum + 1),
    startLineNum,
    endLineNum
  }
}

function skipBlankLines (lines, lineNum) {
  while (lineNum < lines.length && BLANK_LINE_REGEX.test(lines[lineNum])) {
    lineNum += 1
  }
  return lineNum
}

function parseHeadline (lines, lineNum) {
  const headlineLineNum = skipBlankLines(lines, 0)
  if (!HEADLINE_REGEX.test(lines[headlineLineNum])) {
    throw new SyntaxError(`Invalid headline on line ${headlineLineNum}: ${lines[headlineLineNum]}`)
  }

  const [, headline] = lines[headlineLineNum].match(HEADLINE_REGEX)

  return createNode({
    lines,
    name: 'headline',
    kind: 'headline',
    startLineNum: lineNum,
    endLineNum: lineNum,
    value: headline
  })
}

function parseAttribute (lines, attrNameLineNum) {
  const attrNameLine = lines[attrNameLineNum]
  const [, name] = attrNameLine.match(ATTRIBUTE_NAME_REGEX)

  const attrName = `${name}:`
  const attrNameLineValue = attrNameLine.replace(ATTRIBUTE_NAME_REGEX, '')

  const attributeEndConditions = (line) => {
    return ATTRIBUTE_NAME_REGEX.test(line) || SECTION_START_REGEX.test(line)
  }

  let {
    contentLines,
    startLineNum,
    endLineNum
  } = getContentBoundaries(lines, attrNameLineNum, attributeEndConditions)

  // if the first line contains the attribute value, include it
  let startColNum
  if (attrName.length < attrNameLine.length) {
    startLineNum = attrNameLineNum
    startColNum = attrNameLine.length - attrNameLineValue.trimLeft().length
  } else {
    startColNum = lines[startLineNum].length - lines[startLineNum].trimLeft().length
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
    kind: 'attribute',
    startLineNum,
    startColNum,
    endLineNum,
    value: name === 'links' && Array.isArray(parsedValue[name])
      ? parsedValue[name].map(getMarkdownLink)
      : parsedValue[name]
  })
}

function parseSection (lines, lineNum) {
  const titleLineNum = skipBlankLines(lines, lineNum + 1) // + 1 to skip ---

  if (!SECTION_TITLE_REGEX.test(lines[titleLineNum])) {
    throw new SyntaxError(`Invalid section title on line ${titleLineNum}: ${lines[titleLineNum]}`)
  }

  const [, title] = lines[titleLineNum].match(SECTION_TITLE_REGEX)
  const name = sectionTitleToPropMap.get(title)

  const sectionEndCondition = name === 'gameContent'
    ? undefined // game content only ends on a new-line or EOF (it contains multiple --- parts)
    : (line) => SECTION_START_REGEX.test(line)

  const {
    startLineNum,
    endLineNum
  } = getContentBoundaries(lines, titleLineNum, sectionEndCondition)

  const nodeInfo = {
    lines,
    name,
    kind: 'section',
    startLineNum,
    endLineNum
  }

  // empty section
  if (startLineNum === titleLineNum) {
    Object.assign(nodeInfo, {
      endColNum: 0,
      value: null
    })
  }

  return createNode(nodeInfo)
}

export function parse (string = '') {
  // normalize linebreaks to \n.
  string = string.replace(/\r?\n|\r/g, '\n')

  const ast = {
    kind: 'insight',
    nodes: []
  }

  const lines = string.split(/\n/g)

  const headlineNode = parseHeadline(lines, 0)
  ast.nodes.push(headlineNode)

  for (let i = headlineNode.end.line + 1; i < lines.length; i++) {
    const line = lines[i]

    if (BLANK_LINE_REGEX.test(line)) {
      continue
    }

    if (SECTION_START_REGEX.test(line)) {
      const node = parseSection(lines, i)
      ast.nodes.push(node)
      i = node.end.line
      continue
    }

    if (ATTRIBUTE_NAME_REGEX.test(line)) {
      const node = parseAttribute(lines, i)
      ast.nodes.push(node)
      i = node.end.line
      continue
    }

    throw new SyntaxError(`Invalid token on line ${i}: ${line}`)
  }

  return ast
}

export function astToInsight (ast) {
  return ast.nodes.reduce((prev, n) => {
    prev[n.name] = n.value
    return prev
  }, {})
}
