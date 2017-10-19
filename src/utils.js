export const orderedSectionProps = [
  'content',
  'practiceQuestion',
  'reviseQuestion',
  'quiz',
  'footnotes',
  'gameContent'
]

export const sectionPropToTitleMap = new Map([
  ['content', 'Content'],
  ['practiceQuestion', 'Practice'],
  ['reviseQuestion', 'Revision'],
  ['quiz', 'Quiz'],
  ['footnotes', 'Footnotes'],
  ['gameContent', 'Game Content']
])

export const sectionTitleToPropMap = orderedSectionProps
  .reduce((map, prop) => {
    map.set(sectionPropToTitleMap.get(prop), prop)
    return map
  }, new Map())
