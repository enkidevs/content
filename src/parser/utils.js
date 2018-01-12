import remark from 'remark'
import { sectionNameToTitleMap } from '../utils'

export const TYPES = {
  HEADLINE: 'headline',
  SECTION: 'section',
  ATTRIBUTE: 'attribute'
}

export const NAMES = {
  HEADLINE: 'headline',
  ...[...sectionNameToTitleMap.keys()].reduce((hash, key) => {
    hash[key.toUpperCase()] = key
    return hash
  }, {})
}

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

export function getMarkdownLink (link) {
  let result
  if (mdUrlRegExWithType.test(link)) {
    result = mdUrlRegExWithType.exec(link)
    return { name: result[1], url: result[2], nature: result[3] }
  }
  if (mdUrlRegEx.test(link)) {
    result = mdUrlRegEx.exec(link)
    return { name: result[1], url: result[2], nature: 'website' }
  }
  console.log('not found', mdUrlRegExWithType.test(link))
  return {
    nature: 'website',
    name: getDomainFromURL(link),
    url: link
  }
}

export const contentLinesToString = contentArr => contentArr.join('\n').trim()

export const parseMarkdownLines = (lines, start, end) =>
  remark.parse(contentLinesToString(lines.slice(start, end + 1)))

export const HEADLINE_REGEX = /^#\s([^\n]+)/i
export const SECTION_START_REGEX = /^-{3}/
export const SECTION_TITLE_REGEX = /^##\s([a-z\s*]+)/i
export const ATTRIBUTE_NAME_REGEX = /(^[a-z]+):/i
export const QUESTION_GAP_REGEX = /(\?{3})/i
export const BLANK_LINE_REGEX = /^\s*$/

// every node ends when it reaches a new line or EOF
// or if the provided specific end condition function returns `true`
export function getContentBoundaries (
  lines,
  lineNumBeforeContent,
  contentSpecificEndCondition = () => false
) {
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

export function skipBlankLines (lines, lineNum) {
  while (lineNum < lines.length && BLANK_LINE_REGEX.test(lines[lineNum])) {
    lineNum += 1
  }
  return lineNum
}
