/* global describe test expect */
import loadMD from '../utils/load-md'
import ast from '../data/correct-ast.json'
import {parse} from '../../parser'

describe(
  'parsing should return the proper AST',
  () => {
    test('ASTs are equal', () => {
      expect(ast).toEqual(parse(loadMD('correct')))
    })
  }
)
