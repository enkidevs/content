import yaml from 'js-yaml'

export const context = 'quiz'
export const description = 'Insight quiz include title, question and answers in YAML format'
// TODO: add link to guidelines once they are updated

export default function ({data: { quiz }, type}) {
  if (type !== 'insight') return true
  if (typeof quiz === 'undefined') return true
  try {
    const parsedQuiz = yaml.safeLoad(quiz)
    console.log(parsedQuiz)
    if (!parsedQuiz.title || !parsedQuiz.question || (parsedQuiz.answers || []).length < 4) return false
  } catch (e) {
    return false
  }
  return true
}
