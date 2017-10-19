export const context = 'headline-length'
export const description = 'Title should be between 4 and 120 characters'
export const link = 'https://enkidevs.github.io/guidelines/Insights-guidelines.html#practice-question'

export default function ({data: {headline}, type}) {
  if (type !== 'insight') return true
  return typeof headline === 'string' &&
    headline.length > 4 &&
    headline.length < 120
}
