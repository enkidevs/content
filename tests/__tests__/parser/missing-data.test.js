import ava from 'ava'
import loadMD from './utils/load-md'
import {parse} from '../../parser'

const ast = {
  kind: 'insight',
  nodes: [{
    name: 'headline',
    kind: 'headline',
    value: 'This is the headline',
    start: {
      line: 0,
      column: 0
    },
    end: {
      line: 0,
      column: 21
    }
  }, {
    name: 'author',
    kind: 'attribute',
    value: null,
    start: {
      line: 1,
      column: 0
    },
    end: {
      line: 1,
      column: 6
    }
  }, {
    name: 'content',
    kind: 'section',
    value: null,
    start: {
      line: 3,
      column: 0
    },
    end: {
      line: 3,
      column: 0
    }
  }]
}

const md = loadMD('missing-data')

ava.test('parsing should work when data is missing', t => {
  const parsedAST = parse(md)

  t.is(ast.kind, parsedAST.kind, 'AST kinds are not equal')

  ast.nodes.forEach((node, i) => {
    t.deepEqual(node, parsedAST.nodes[i], 'failing node ' + node.name)
  })
})

