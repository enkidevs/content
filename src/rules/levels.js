export const context = 'levels'
export const description = 'Levels should exist in database.'
export const link = 'https://enkidevs.github.io/guidelines/Insights-guidelines.html#levels-m'

export default function ({data: {levels}, type}) {
  if (type !== 'insight') return true
  return Array.isArray(levels) && !!levels.length
}
