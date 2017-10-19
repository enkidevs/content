/* global describe test expect */
import loadMD from '../utils/load-md'
import ast from '../data/crlf-vs-lf-ast.json'
import {parse} from '../../parser'

describe(
  'parsing should work for CRLF or CR or LF whitespace between content',
  () => {
    test('ASTs are equal', () => {
      expect(ast).toEqual(parse(loadMD('crlf-vs-lf')))
    })
  }
)
