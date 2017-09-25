import yaml from 'js-yaml'

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

export function generate (insight) {
  const {headline, content, practiceQuestion, reviseQuestion, gameContent, footnotes, ...attributes} = insight

  if (attributes.links) {
    attributes.links = attributes.links.map(toMarkdownLink)
  }

  return `# ${headline}\n` +
    yaml.safeDump(attributes, {skipInvalid: true, newline: '\n\n'}) +
    '\n---\n## Content\n\n' + (content || '').trim() +
    (practiceQuestion ? ('\n\n---\n## Practice\n\n' + practiceQuestion.trim()) : '') +
    (reviseQuestion ? ('\n\n---\n## Revision\n\n' + reviseQuestion.trim()) : '') +
    (footnotes ? ('\n\n---\n## Footnotes\n\n' + footnotes.trim()) : '') +
    (gameContent ? ('\n\n---\n## Game Content\n\n' + gameContent.trim()) : '')
}
