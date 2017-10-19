import { extractNames } from '../pathUtils'

export const context = 'parent'
export const description = 'Parent must exist in database'
export const link = 'https://enkidevs.github.io/guidelines/Insights-guidelines.html#parent'

export default function ({data: {parent}, type}, {db, otherFiles, team}) {
  if (type !== 'insight' && type !== 'workout') return true
  if (typeof parent === 'undefined') return true
  if (otherFiles && otherFiles.length) {
    if (otherFiles
      .filter((f) => f.type === type)
      .map(({filename}) => extractNames(filename, team))
      .find(({slug, workoutName}) => (type === 'insight' ? slug : workoutName) === parent)) {
      return true
    }
  }
  return db[type].findOne({slug: parent}, '_id').lean()
}
