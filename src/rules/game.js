import { extractNames } from '../pathUtils'

export const context = 'game'
export const description = 'Workout game must exit in database or as new files.'

export default function ({data: {game}, type}, {db, otherFiles, team}) {
  if (type !== 'workout') return true
  if (typeof game === 'undefined') return true
  let found = false
  if (otherFiles && otherFiles.length) {
    found = otherFiles
      .filter((f) => f.type === 'insight')
      .map(({filename}) => extractNames(filename, team))
      .some(fileSlug => fileSlug === game)
  }
  return found || db.insight.count({slug: game})
}
