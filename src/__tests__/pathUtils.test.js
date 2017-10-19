/* global describe test expect */
import {extractNames} from '../pathUtils'

describe('pathUtils', () => {
  test('should extract the names from a path', () => {
    expect(
      extractNames('In-house Guidelines and Information/Info for all/remote-guidelines/test.md', {_id: 'teamId'})
    ).toEqual({
      archived: false,
      slug: 'test',
      subtopicName: 'Info for all',
      topicName: 'teamId-In-house Guidelines and Information',
      workoutName: 'remote-guidelines'
    })
  })
})
