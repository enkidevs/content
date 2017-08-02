import { extractNames } from '../pathUtils'

export const context = 'slug'
export const description = 'Slug shouldn\'t already exist'

export default function ({filename, previous_filename, status, type}, {db, team}) {
  if (type !== 'insight') return true
  const {slug} = extractNames(filename, team)

  const previous = previous_filename || (status === 'modified' && filename) || '' // eslint-disable-line camelcase
  let previousSlug
  if (previous) {
    previousSlug = extractNames(previous, team).slug
  }

  if (!previousSlug || previousSlug !== slug) {
    return db.insight.findOne({slug}, '_id').lean().then(i => !i)
  }
  return true
}
