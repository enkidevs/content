import { ARCHIVED_FOLDER } from './constants'

export function encodePath (_path = '') {
  return _path.replace(/#/g, 'sharp')
}

export function decodePath (_path = '') {
  return _path.replace(/sharp/g, '#')
}

export function extractNames (filename = '', team) {
  let sections = filename.split('/')
  const slug = sections.pop().split('.md')[0]

  const archived = sections[0] === ARCHIVED_FOLDER
  if (archived) {
    sections.shift() // remove .archived from the array
  }

  const topicName = (team && sections[0] ? (team._id.toString() + '-') : '') + decodePath(sections.shift())
  const subtopicName = decodePath(sections.shift())
  const workoutName = decodePath(sections.shift())

  return {
    archived,
    subtopicName,
    topicName,
    workoutName,
    slug
  }
}
