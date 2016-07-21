import yaml from 'js-yaml'

export function parse (string = '') {
  const sections = string.split('---')

  const meta = sections[0]

  let [headline, ...props] = meta.split('\n')
  headline = headline.replace(/^#\s/, '')

  const yamlString = props.join('\n').replace(/^\s+|\s+$/g, '')

  const attributes = yaml.safeLoad(yamlString) || {}

  let content
  let gameContent
  let practiceQuestion
  let reviseQuestion

  sections.slice(1).forEach(section => {
    if (section.indexOf('\n## Content\n\n') === 0) {
      content = section.replace(/^\n##\sContent\n\n/, '').trim()
    } else if (section.indexOf('\n## Practice\n\n') === 0) {
      practiceQuestion = section.replace(/^\n##\sPractice\n\n/, '').trim()
    } else if (section.indexOf('\n## Revision\n\n') === 0) {
      reviseQuestion = section.replace(/^\n##\sRevision\n\n/, '').trim()
    } else if (section.indexOf('\n## Game Content\n\n') === 0) {
      gameContent = section.replace(/^\n##\sGame\sContent\n\n/, '').trim()
    }
  })

  return {...attributes, headline, content, practiceQuestion, reviseQuestion, gameContent}
}

export function generate (insight) {
  const {headline, content, practiceQuestion, reviseQuestion, gameContent, ...attributes} = insight

  return `# ${headline}\n` +
    yaml.safeDump(attributes, {skipInvalid: true, newline: '\n\n'}) +
    '\n---\n## Content\n\n' + (content || '').trim() +
    (gameContent ? ('\n\n---\n## Game Content\n\n' + gameContent.trim()) : '') +
    (practiceQuestion ? ('\n\n---\n## Practice\n\n' + practiceQuestion.trim()) : '') +
    (reviseQuestion ? ('\n\n---\n## Revision\n\n' + reviseQuestion.trim()) : '')
}
