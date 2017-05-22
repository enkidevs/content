import ava from 'ava'
import loadMD from './utils/load-md'
import {parse} from '../../parser'

const mdHeadline = loadMD('invalid-syntax-headline')
const mdAttr = loadMD('invalid-syntax-attribute')
const mdAttrTitle = loadMD('invalid-syntax-attribute-title')
const mdSection = loadMD('invalid-syntax-section')
const mdSectionTitle = loadMD('invalid-syntax-section-title')

ava.test('parsing should throw on invalid headline syntax', t => {
  const error = t.throws(() => {
    parse(mdHeadline)
  }, SyntaxError)

  t.regex(error.message, /Invalid headline on line [0-9]+:/)
})

ava.test('parsing should throw on invalid attribute syntax', t => {
  const error = t.throws(() => {
    parse(mdAttr)
  })

  t.is(error.name, 'YAMLException')
})

ava.test('parsing should throw on missing attribute title', t => {
  const error = t.throws(() => {
    parse(mdAttrTitle)
  })

  t.is(error.name, 'SyntaxError')
})

ava.test('parsing should throw on invalid section syntax', t => {
  const error = t.throws(() => {
    parse(mdSection)
  }, SyntaxError)

  t.regex(error.message, /Invalid section title on line [0-9]+:/)
})

ava.test('parsing should throw on invalid section title', t => {
  const error = t.throws(() => {
    parse(mdSectionTitle)
  }, SyntaxError)

  t.regex(error.message, /Invalid section title on line [0-9]+:/)
})
