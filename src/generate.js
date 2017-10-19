import { orderedSectionProps, sectionPropToTitleMap } from './utils'

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

function generateSection ({ title, content }) {
  const cleanContent = content.trim()
  return content ? `---\n## ${title}\n\n${cleanContent}` : ''
}

export function generate (insight) {
  if (insight.links) {
    insight = Object.assign({}, insight, {
      links: insight.links.map(toMarkdownLink)
    })
  }

  // extract section title and content, in the proper order
  const sections = orderedSectionProps.map(sectionProp => ({
    title: sectionPropToTitleMap.get(sectionProp),
    content: insight[sectionProp]
  }))

  // attributes are all properties left when we extract
  // the headline and the sections
  const attributes = Object.keys(insight)
    .filter(prop => prop !== 'headline' && !sectionPropToTitleMap.has(prop))
    .reduce((obj, attrProp) => {
      obj[attrProp] = insight[attrProp]
      return obj
    }, {})

  return `# ${insight.headline}
${yaml.safeDump(attributes, { skipInvalid: true, newline: '\n\n' })}
${sections.map(generateSection).join('\n\n')}
`
}
