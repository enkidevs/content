import ava from 'ava'
import loadMD from './utils/load-md'
import {parse} from '../../parser'

const ast = {
  kind: 'insight',
  nodes: [{
    name: 'headline',
    kind: 'headline',
    value: 'It\'s the headline',
    start: {
      line: 0,
      column: 0
    },
    end: {
      line: 0,
      column: 18
    }
  }, {
    name: 'author',
    kind: 'attribute',
    value: 'Mathieu',
    start: {
      line: 1,
      column: 8
    },
    end: {
      line: 1,
      column: 14
    }
  }, {
    name: 'levels',
    kind: 'attribute',
    value: ['basic', 'medium'],
    start: {
      line: 3,
      column: 2
    },
    end: {
      line: 4,
      column: 9
    }
  }, {
    name: 'type',
    kind: 'attribute',
    value: 'normal',
    start: {
      line: 5,
      column: 6
    },
    end: {
      line: 5,
      column: 11
    }
  }, {
    name: 'category',
    kind: 'attribute',
    value: 'tip',
    start: {
      line: 6,
      column: 10
    },
    end: {
      line: 6,
      column: 12
    }
  }, {
    name: 'tags',
    kind: 'attribute',
    value: ['list', 'of', 'tags'],
    start: {
      line: 8,
      column: 2
    },
    end: {
      line: 10,
      column: 7
    }
  }, {
    name: 'parent',
    kind: 'attribute',
    value: 'slug-of-the-parent',
    start: {
      line: 11,
      column: 8
    },
    end: {
      line: 11,
      column: 25
    }
  }, {
    name: 'notes',
    kind: 'attribute',
    value: 'whatever',
    start: {
      line: 12,
      column: 7
    },
    end: {
      line: 12,
      column: 14
    }
  }, {
    name: 'inAlgoPool',
    kind: 'attribute',
    value: false,
    start: {
      line: 13,
      column: 12
    },
    end: {
      line: 13,
      column: 16
    }
  }, {
    name: 'links',
    kind: 'attribute',
    value: [{
      nature: 'website',
      name: 'name',
      url: 'url'
    }, {
      nature: 'forum',
      name: 'name',
      url: 'url'
    }],
    start: {
      line: 15,
      column: 2
    },
    end: {
      line: 16,
      column: 23
    }
  }, {
    name: 'content',
    kind: 'section',
    value: `
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
    start: {
      line: 21,
      column: 0
    },
    end: {
      line: 57,
      column: 95
    }
  }, {
    name: 'practiceQuestion',
    kind: 'section',
    value: 'practice question',
    start: {
      line: 62,
      column: 0
    },
    end: {
      line: 62,
      column: 16
    }
  }, {
    name: 'reviseQuestion',
    kind: 'section',
    value: 'revision question',
    start: {
      line: 67,
      column: 0
    },
    end: {
      line: 67,
      column: 16
    }
  }, {
    name: 'footnotes',
    kind: 'section',
    value: 'no idea what is should look like',
    start: {
      line: 72,
      column: 0
    },
    end: {
      line: 72,
      column: 31
    }
  }, {
    name: 'gameContent',
    kind: 'section',
    value: 'game content',
    start: {
      line: 77,
      column: 0
    },
    end: {
      line: 77,
      column: 11
    }
  }]
}

const md = loadMD('correct')

ava.test('parsing should return the proper AST', t => {
  const parsedAST = parse(md)

  t.is(ast.kind, parsedAST.kind, 'AST kinds are not equal')

  ast.nodes.forEach((node, i) => {
    t.deepEqual(node, parsedAST.nodes[i], 'failing node ' + node.name)
  })
})

