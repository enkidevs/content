export const context = 'category'
export const description = 'category'
export const link = 'https://enkidevs.github.io/guidelines/Insights-guidelines.html#category-m'

export default function ({data: {category}, type}, {db}) {
  if (type !== 'insight') return true
  return typeof category === 'string' && !!category.length && db.category.findOne({name: category}, '_id').lean().then(c => !!c)
}
