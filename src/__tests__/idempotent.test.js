/* global describe test expect */
import {parse, astToInsight} from '../parser'
import {generate} from '../generate'
import insight from './data/correct-insight.json'
import loadMD from './utils/load-md'

describe('idempotent', () => {
  test('generate should convert insight back to its md format', () => {
    expect(
      generate(insight)
    ).toEqual(
      loadMD('correct')
    )
  })
  test('generate and then parsing should return the original', () => {
    expect(
      astToInsight(
        parse(
          generate(insight)
        )
      )
    ).toEqual(insight)
  })
})

