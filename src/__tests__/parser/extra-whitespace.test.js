/* global describe test expect */
import loadMD from '../utils/load-md'
import ast from '../data/extra-whitespace-ast.json'
import {parse} from '../../parser'

describe(
  'parsing should work for extra vertical whitespace between content',
  () => {
    test('ASTs are equal', () => {
      expect(ast).toEqual(parse(loadMD('extra-whitespace')))
    })
  }
)
