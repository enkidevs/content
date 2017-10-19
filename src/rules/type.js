export const context = 'type'
export const description = 'type'
export const link = 'https://enkidevs.github.io/guidelines/Insights-guidelines.html#type-m'

const TYPES = [
  'normal',
  'bugScroll',
  'bugSpot',
  'fillTheGap',
  'evaluateThis',
  'refactor',
  'tetris'
]

const WORKOUT_TYPES = [
  'insights-list',
  'game',
  'quizz'
]

export default function ({data: {type}, type: fileType}) {
  if (fileType === 'workout') {
    return typeof type === 'string' && WORKOUT_TYPES.includes(type)
  }
  if (fileType !== 'insight') return true
  return typeof type === 'undefined' ||
         (typeof type === 'string' && TYPES.includes(type))
}
