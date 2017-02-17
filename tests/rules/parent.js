export const context = 'parent'
export const description = 'Parent insight must exist in database'
export const link = 'https://enkidevs.github.io/guidelines/Insights-guidelines.html#parent'

export default function ({parent}, {db}) {
  if (typeof parent === 'undefined') return true
  return db.insight.findOne({slug: parent}, '_id').lean()
}
