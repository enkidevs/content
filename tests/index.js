import ava from 'ava'

import {generate, parse} from './parser'

const insight = {
  author: 'Mathieu',
  levels: ['basic', 'medium'],
  type: 'normal',
  headline: 'This is the headline',
  content: `
  this is the content,
  you can *add* some markdown
  and \`code\` or
  \`\`\`
  block code
  \`\`\`
  `.trim(),
  footnotes: 'no idea what is should look like',
  gameContent: 'game content',
  practiceQuestion: 'practice question',
  reviseQuestion: 'revision question',
  category: 'tip',
  tags: ['list', 'of', 'tags'],
  parent: 'slug-of-the-parent',
  notes: 'whatever',
  inAlgoPool: false,
  links: [{
    nature: 'website',
    url: 'url'
  }, {
    nature: 'website',
    url: 'url'
  }]
}

ava.test('generate and then parsing should return the original', t => {
  const parsedInsight = parse(generate(insight))
  return t.deepEqual(parsedInsight, insight)
})
