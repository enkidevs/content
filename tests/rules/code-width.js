export const context = 'code-width'
export const description = 'Code blocks should be less than 44 chars wide'
export const link = 'https://enkidevs.github.io/guidelines/Insights-guidelines.html#content-m'

export default function ({data: {content, footnotes, reviseQuestion, practiceQuestion}, type}) {
  if (type !== 'insight') return true
  return content && checkLines(content) &&
    (typeof footnotes === 'undefined' || checkLines(footnotes)) &&
    (typeof reviseQuestion === 'undefined' || checkLines(reviseQuestion)) &&
    (typeof practiceQuestion === 'undefined' || checkLines(practiceQuestion))
}

function checkLines (data) {
  return !data
          .split('```')
          .filter((block, i) =>
            i % 2 &&
            block
              .split('\n')
              .filter((line) => line.length > 44)
              .length
          ).length
}
