import yaml from 'js-yaml'

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
    return {name: result[1], url: result[2]}
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
  if (link.nature) {
    text += `{${link.nature}}`
  }
  return text
}

export function parse (string = '') {
  const sections = string.split('---')

  const meta = sections[0]

  let [headline, ...props] = meta.split('\n')
  headline = headline.replace(/^#\s/, '')

  const yamlString = props.join('\n').replace(/^\s+|\s+$/g, '')

  const attributes = yaml.safeLoad(yamlString) || {}

  if (attributes.links) {
    attributes.links = attributes.links.map(getMarkdownLink)
  }

  let content
  let gameContent
  let practiceQuestion
  let reviseQuestion
  let footnotes

  sections.slice(1).forEach(section => {
    if (section.indexOf('\n## Content\n\n') === 0) {
      content = section.replace(/^\n##\sContent\n\n/, '').trim()
    } else if (section.indexOf('\n## Practice\n\n') === 0) {
      practiceQuestion = section.replace(/^\n##\sPractice\n\n/, '').trim()
    } else if (section.indexOf('\n## Revision\n\n') === 0) {
      reviseQuestion = section.replace(/^\n##\sRevision\n\n/, '').trim()
    } else if (section.indexOf('\n## Game Content\n\n') === 0) {
      gameContent = section.replace(/^\n##\sGame\sContent\n\n/, '').trim()
    } else if (section.indexOf('\n## Footnotes\n\n') === 0) {
      footnotes = section.replace(/^\n##\sFootnotes\n\n/, '').trim()
    }
  })

  return {...attributes, headline, content, practiceQuestion, reviseQuestion, gameContent, footnotes}
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
