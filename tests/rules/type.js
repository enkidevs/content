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

export default function ({type}) {
  return typeof type === 'undefined' ||
         (typeof type === 'string' && TYPES.includes(type))
}
