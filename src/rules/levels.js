export const context = 'levels'
export const description = 'Levels should exist in database.'
export const link = 'https://enkidevs.github.io/guidelines/Insights-guidelines.html#levels-m'

export default function ({data: {levels}, type}, {db}) {
  if (type !== 'insight') return true
  return Array.isArray(levels) && !!levels.length &&
   db.level.count({label: {$in: levels}}).then(res => res === levels.length)
}
