import questionParser from '../questionParser'

export const context = 'practice-question'
export const description = 'practice-question'
export const link = 'https://enkidevs.github.io/guidelines/Insights-guidelines.html#practice-question'

export default function ({practiceQuestion}) {
  if (typeof practiceQuestion === 'undefined') return true
  if (questionParser(practiceQuestion) instanceof Error) return false
  return true
}
