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

function setPropertiesData (parsedJson, lines) {
  const newJson = {}
  Object.keys(parsedJson).forEach(key => {
    const content = parsedJson[key]

    // Things are getting a + 1 there because the index starts from zero
    if (Array.isArray(content)) {
      newJson[key] = {
        value: content.map(listValue => ({
          value: listValue,
          line: lines.indexOf(lines.find(line => line.indexOf(listValue) >= 0)) + 1,
          column: lines.find(line => line.indexOf(listValue) >= 0).indexOf(listValue) + 1,
          tip: key + ':',
          length: listValue.length
        })),
        line: lines.indexOf(lines.find(line => line.indexOf(key + ':') >= 0)) + 1,
        column: 1,
        tip: key + ':',
        length: content.reduce((prev, next) => prev + next.length, 0)
      }
    } else {
      newJson[key] = {
        value: content,
        line: lines.indexOf(lines.find(line => line.indexOf(key + ':') >= 0)) + 1,
        column: (key + ':').length + 1,
        tip: key + ':',
        length: content.toString().length
      }
    }
  })

  return newJson
}

function getReferenceByProp (prop) {
  let regex
  let string
  switch (prop) {
    case 'content':
      regex = /\n##\sContent\n*/
      string = '## Content'
      break
    case 'practiceQuestion':
      regex = /\n##\sPractice\n*/
      string = '## Practice'
      break
    case 'reviseQuestion':
      regex = /\n##\sRevision\n*/
      string = '## Revision'
      break
    case 'gameContent':
      regex = /\n##\sGame\sContent\n*/
      string = '## Game Content'
      break
    case 'footnotes':
      regex = /\n##\sFootnotes\n*/
      string = '## Footnotes'
  }

  return {regex, string}
}

function fillNullProperties (parsedProperties) {
  const completeProperties = [
    'headline',
    'author',
    'levels',
    'type',
    'category',
    'links',
    'notes',
    'parent',
    'tags',
    'inAlgoPool',
    'content',
    'gameContent',
    'practiceQuestion',
    'reviseQuestion',
    'footnotes'
  ]

  completeProperties.forEach(prop => {
    const found = Object.keys(parsedProperties).some(parsedProp => {
      if (parsedProp === prop && parsedProperties[parsedProp]) {
        return true
      }
    })

    if (!found) {
      const tip = getReferenceByProp(prop)
      parsedProperties[prop] = {
        value: null,
        line: null,
        column: null,
        tip: tip.string ? tip.string : prop + ':',
        length: 0
      }
    }
  })

  return parsedProperties
}

export function parse (string = '') {
  const sections = string.split('---')
  const lines = string.split('\n')

  const meta = sections.shift()

  let [headline, ...props] = meta.split('\n')

  // Extracts only the headline (removes # and whitespaces from the original .md)
  const rawHeadline = headline.replace(/^#\s/, '')
  headline = {
    value: rawHeadline,
    line: 1,
    column: headline.indexOf(rawHeadline) + 1,
    tip: '# My Headline (First line in .md)',
    length: rawHeadline ? rawHeadline.length : null
  }

  // Parses the string into yaml then json
  const yamlString = props.join('\n').replace(/^\s+|\s+$/g, '')
  // The next replace is to replace (author:stefano) for (author: stefano)
  // since it would crash the yaml
  let attributes = yaml.safeLoad(yamlString.replace(/\b[:]\b/g, ': ')) || {}

  // Sets extra info for better error handling
  attributes = setPropertiesData(attributes, lines)
  // Insert 'links' array
  if (attributes.links && attributes.links.value) {
    attributes.links.value = attributes.links.value.map(link => {
      const linkProps = link
      linkProps.value = getMarkdownLink(linkProps.value)
      return linkProps
    })
  }

  const parsed = {
    content: undefined,
    gameContent: undefined,
    practiceQuestion: undefined,
    reviseQuestion: undefined,
    footnotes: undefined
  }

  // Parse the content of the .md file
  let lastProp
  sections.forEach(section => {
    const foundSection = Object.keys(parsed).some(prop => {
      const {regex, string} = getReferenceByProp(prop)

      if (regex.test(section)) {
        parsed[prop] = {
          value: section.replace(regex, '').trim(),
          line: lines.indexOf(lines.find(l => l.indexOf(string) >= 0)) + 2,
          column: 1, // These sections always start at the first column
          tip: string,
          length: section.replace(regex, '').length
        }
        lastProp = prop
        return true
      }
    })
    // If this section does not start with one property, it belongs to the previous
    if (!foundSection) {
      parsed[lastProp].value += '---' + section
      parsed[lastProp].length += ('---' + section).length
    }
  })

  return fillNullProperties({...attributes, headline, ...parsed})
}

export function generate (insight) {
  const {headline, content, practiceQuestion, reviseQuestion, gameContent, footnotes, ...attributes} = insight

  const simplifiedJson = {}
  Object.keys(attributes).forEach(prop => {
    const attribute = attributes[prop]
    if (Array.isArray(attribute.value)) {
      simplifiedJson[prop] = attribute.value.map(v => v.value)
    } else {
      simplifiedJson[prop] = attribute.value
    }
  })

  if (simplifiedJson.links) {
    simplifiedJson.links = simplifiedJson.links.map(toMarkdownLink)
  }
  simplifiedJson.inAlgoPool = false

  return `# ${headline.value}\n` +
    yaml.safeDump(simplifiedJson, {skipInvalid: true, newline: '\n\n'}) +
    '\n---\n## Content\n\n' + (content.value || '').trim() +
    (gameContent.value ? ('\n\n---\n## Game Content\n\n' + gameContent.value.trim()) : '') +
    (practiceQuestion.value ? ('\n\n---\n## Practice\n\n' + practiceQuestion.value.trim()) : '') +
    (reviseQuestion.value ? ('\n\n---\n## Revision\n\n' + reviseQuestion.value.trim()) : '') +
    (footnotes.value ? ('\n\n---\n## Footnotes\n\n' + footnotes.value.trim()) : '')
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
