/* global describe test expect */
import loadMD from '../utils/load-md'
import ast from '../data/missing-data-ast.json'
import {parse} from '../../parser'

describe(
  'parsing should work when data is missing',
  () => {
    test('ASTs are equal', () => {
      expect(ast).toEqual(parse(loadMD('missing-data')))
    })
  }
)
