import isEqual from 'lodash.isequal'

export const context = 'footnotes'
export const description = 'footnotes'
export const link = 'https://enkidevs.github.io/guidelines/Insights-guidelines.html#footnotes'

export default function ({data: {content, footnotes}, type}) {
  if (type !== 'insight') return true
  if (typeof footnotes === 'undefined') return true
  return isEqual(
    content.match(/\[(\d+)]/g).map(match => match.slice(1, 2)),
    footnotes.match(/\[(\d+):(.+)]/g).map(match => match.slice(1, 2))
  )
}
