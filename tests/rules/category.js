export const context = 'category'
export const description = 'category'
export const link = 'https://enkidevs.github.io/guidelines/Insights-guidelines.html#category-m'

export default function ({category}) {
  return typeof category === 'string' && !!category.length
}
