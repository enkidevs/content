import ava from 'ava'

import {parse, astToInsight} from '../parser'
import {generate} from '../generate'

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
    nature: 'forum',
    name: 'name',
    url: 'url'
  }]
}

const md = "# This is the headline\nauthor: Mathieu\nlevels:\n  - basic\n  - medium\ntype: normal\ncategory: tip\ntags:\n  - list\n  - of\n  - tags\nparent: slug-of-the-parent\nnotes: whatever\ninAlgoPool: false\nlinks:\n  - '[name](url)'\n  - '[name](url){forum}'\n\n---\n## Content\n\n`vmstat` allows the user to monitor virtual\n    memory statistics such as processes, memory,\n    paging, block IO, traps , disks and cpu\n    activity.\n\n    The user can specify a sampling period.\n\n    ```bash\n    $ vmstat 1\n    procs -----------memory----------\n     r  b   swpd   free   buff  cache\n     4  0 920708  74004  36324 114148\n     ---swap-------io---- -system--\n       si   so    bi    bo   in   cs\n       29   53   125   112  298  212\n       ----cpu----\n     us sy id wa\n     26  6 65  3\n    ```\n\n    The above will run `vmstat` every second and\n    display system virtual memory usage such\n    as:\n    - `r` number process waiting to run\n    - `b`\n    blocked process\n    - `swpd` virtual memory used\n    -\n    `free` idle memory\n    -  `bi`, `bo` number of\n    blocks sent and received from disk\n    - `us`\n    time spent in user code\n    - `sy` time spent in\n    kernel code\n\n    As current Linux blocks are `1024` bytes, `vmstat` uses the same unit of measurement for memory.\n\n---\n## Game Content\n\ngame content\n\n---\n## Practice\n\npractice question\n\n---\n## Revision\n\nrevision question\n\n---\n## Footnotes\n\nno idea what is should look like"

ava.test('generate and then parsing should return the original', t => {
  const generatedInsight = generate(insight)
  t.is(generatedInsight, md)
  const parsedInsight = astToInsight(parse(generatedInsight))
  Object.keys(insight).forEach(k => {
    t.deepEqual(insight[k], parsedInsight[k], 'failing key ' + k)
  })
})
