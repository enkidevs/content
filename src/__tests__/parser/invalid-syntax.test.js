/* global describe test expect */
import loadMD from '../utils/load-md'
import {parse} from '../../parser'

const mdHeadline = loadMD('invalid-syntax-headline')
const mdAttr = loadMD('invalid-syntax-attribute')
const mdAttrTitle = loadMD('invalid-syntax-attribute-title')
const mdSection = loadMD('invalid-syntax-section')
const mdSectionTitle = loadMD('invalid-syntax-section-title')

describe('invalid syntax', () => {
  test('parsing should throw on invalid headline syntax', () => {
    expect(() => {
      parse(mdHeadline)
    }).toThrow(/Invalid headline on line [0-9]+:/)
  })

  test('parsing should throw on invalid attribute syntax', () => {
    expect(() => {
      parse(mdAttr)
    }).toThrow()
  })

  test('parsing should throw on missing attribute title', () => {
    expect(() => {
      parse(mdAttrTitle)
    }).toThrow(/Invalid token on line [0-9]+:/)
  })

  test('parsing should throw on invalid section syntax', () => {
    expect(() => {
      parse(mdSection)
    }).toThrow(/Invalid section title on line [0-9]+:/)
  })

  test('parsing should throw on invalid section title', () => {
    expect(() => {
      parse(mdSectionTitle)
    }).toThrow(/Invalid section title on line [0-9]+:/)
  })
})
