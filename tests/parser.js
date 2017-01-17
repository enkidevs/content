import path from 'path'
import yaml from 'js-yaml'

export const ARCHIVED_FOLDER = '.archived'

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

function toMarkdownLink (link) {
  let text = link.url
  if (link.name) {
    text = `[${link.name}](${text})`
  }
  if (link.nature && link.nature !== 'website') {
    text += `{${link.nature}}`
  }
  return text
}

export function parse (string = '') {
  let sections = string.split('---')

  const meta = sections.shift()

  let [headline, ...props] = meta.split('\n')
  headline = headline.replace(/^#\s/, '')

  const yamlString = props.join('\n').replace(/^\s+|\s+$/g, '')

  const attributes = yaml.safeLoad(yamlString) || {}

  if (attributes.links) {
    attributes.links = attributes.links.map(getMarkdownLink)
  }

  const parsed = {
    content: undefined,
    gameContent: undefined,
    practiceQuestion: undefined,
    reviseQuestion: undefined,
    footnotes: undefined
  }
  let last

  sections.forEach(section => {
    if (section.indexOf('\n## Content\n\n') === 0) {
      last = 'content'
      parsed[last] = section.replace(/^\n##\sContent\n\n/, '')
    } else if (section.indexOf('\n## Practice\n\n') === 0) {
      last = 'practiceQuestion'
      parsed[last] = section.replace(/^\n##\sPractice\n\n/, '')
    } else if (section.indexOf('\n## Revision\n\n') === 0) {
      last = 'reviseQuestion'
      parsed[last] = section.replace(/^\n##\sRevision\n\n/, '')
    } else if (section.indexOf('\n## Game Content\n\n') === 0) {
      last = 'gameContent'
      parsed[last] = section.replace(/^\n##\sGame\sContent\n\n/, '')
    } else if (section.indexOf('\n## Footnotes\n\n') === 0) {
      last = 'footnotes'
      parsed[last] = section.replace(/^\n##\sFootnotes\n\n/, '')
    } else {
      parsed[last] += '---' + section
    }
  })

  Object.keys(parsed).forEach(k => {
    if (parsed[k]) {
      parsed[k] = parsed[k].trim()
    }
  })

  return {...attributes, headline, ...parsed}
}

export function generate (insight) {
  const {headline, content, practiceQuestion, reviseQuestion, gameContent, footnotes, ...attributes} = insight

  if (attributes.links) {
    attributes.links = attributes.links.map(toMarkdownLink)
  }

  return `# ${headline}\n` +
    yaml.safeDump(attributes, {skipInvalid: true, newline: '\n\n'}) +
    '\n---\n## Content\n\n' + (content || '').trim() +
    (gameContent ? ('\n\n---\n## Game Content\n\n' + gameContent.trim()) : '') +
    (practiceQuestion ? ('\n\n---\n## Practice\n\n' + practiceQuestion.trim()) : '') +
    (reviseQuestion ? ('\n\n---\n## Revision\n\n' + reviseQuestion.trim()) : '') +
    (footnotes ? ('\n\n---\n## Footnotes\n\n' + footnotes.trim()) : '')
}

export function encodePath (_path = '') {
  return _path.replace(/#/g, 'sharp')
}

export function decodePath (_path = '') {
  return _path.replace(/sharp/g, '#')
}

export function extractNames (filename = '', team) {
  let subtopicName = filename.split(path.sep)
  const slug = subtopicName.pop().split('.md')[0]
  const archived = subtopicName[0] === ARCHIVED_FOLDER
  if (archived) {
    subtopicName.shift() // remove .archived from the array
  }
  const topicName = (team ? (team._id.toString() + '-') : '') +
    decodePath(subtopicName.shift())
  subtopicName = decodePath(subtopicName.join(path.sep))

  return {
    archived,
    subtopicName,
    topicName,
    slug
  }
}
