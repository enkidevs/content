import ava from 'ava'

import {extractNames} from '../pathUtils'

ava.test('should extract the names from a path', t => {
  t.deepEqual(extractNames('In-house Guidelines and Information/Info for all/remote-guidelines/test.md', {_id: 'teamId'}), {
    archived: false,
    slug: 'test',
    subtopicName: 'Info for all',
    topicName: 'teamId-In-house Guidelines and Information',
    workoutName: 'remote-guidelines'
  })
})
