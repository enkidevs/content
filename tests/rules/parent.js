import { extractNames } from '../pathUtils'

export const context = 'parent'
export const description = 'Parent insight must exist in database'
export const link = 'https://enkidevs.github.io/guidelines/Insights-guidelines.html#parent'

export default function ({parent}, {db, otherFiles, team}) {
  if (typeof parent === 'undefined') return true
  if (otherFiles && otherFiles.length) {
    if (otherFiles.map(({filename}) => extractNames(filename, team).slug).indexOf(parent) !== -1) {
      return true
    }
  }
  return db.insight.findOne({slug: parent}, '_id').lean()
}
