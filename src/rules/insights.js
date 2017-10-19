import { extractNames } from '../pathUtils'

export const context = 'insights'
export const description = 'Insights must exist in database'

export default function ({data: {insights}, type}, {db, otherFiles, team}) {
  if (type !== 'workout') return true
  if (typeof insights === 'undefined') return true
  if (!Array.isArray(insights)) return false
  let found = 0
  if (otherFiles && otherFiles.length) {
    otherFiles
      .filter((f) => f.type === 'insight')
      .map(({filename}) => extractNames(filename, team))
      .forEach(({slug}) => {
        if (insights.indexOf(slug) >= 0) {
          found++
        }
      })
  }
  if (found >= insights.length) {
    return true
  }
  return db.insight.count({slug: {$in: insights}}).then((res) => {
    return res + found >= insights.length
  })
}
