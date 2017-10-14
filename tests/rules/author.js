export const context = 'author'
export const description = 'author'
export const link = 'https://enkidevs.github.io/guidelines/Insights-guidelines.html#author-m'

export default function ({data: {author}, type}) {
  if (type !== 'insight') return true
  return typeof author === 'string' && !!author.length
