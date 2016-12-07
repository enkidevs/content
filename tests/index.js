import ava from 'ava'

import {generate, parse} from './parser'

const insight = {
  author: 'Mathieu',
  levels: ['basic', 'medium'],
  type: 'normal',
  headline: 'This is the headline',
  content: `
  \`vmstat\` allows the user to monitor virtual
    memory statistics such as processes, memory,
    paging, block IO, traps , disks and cpu
    activity.

    The user can specify a sampling period.

    \`\`\`bash
    $ vmstat 1
    procs -----------memory----------
     r  b   swpd   free   buff  cache
     4  0 920708  74004  36324 114148
     ---swap-------io---- -system--
       si   so    bi    bo   in   cs
       29   53   125   112  298  212
       ----cpu----
     us sy id wa
     26  6 65  3
    \`\`\`

    The above will run \`vmstat\` every second and
    display system virtual memory usage such
    as:
    - \`r\` number process waiting to run
    - \`b\`
    blocked process
    - \`swpd\` virtual memory used
    -
    \`free\` idle memory
    -  \`bi\`, \`bo\` number of
    blocks sent and received from disk
    - \`us\`
    time spent in user code
    - \`sy\` time spent in
    kernel code

    As current Linux blocks are \`1024\` bytes, \`vmstat\` uses the same unit of measurement for memory.
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
    name: 'name',
    url: 'url'
  }, {
    nature: 'website',
    name: 'name',
    url: 'url'
  }]
}

ava.test('generate and then parsing should return the original', t => {
  const parsedInsight = parse(generate(insight))
  Object.keys(insight).forEach(k => {
    t.deepEqual(insight[k], parsedInsight[k], 'failing key ' + k)
  })
})
