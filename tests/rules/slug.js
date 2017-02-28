import { extractNames } from '../pathUtils'

export const context = 'slug'
export const description = 'Slug shouldn\'t already exist'

export default function (file, {db, rawFile, team, status}) {
  const {slug} = extractNames(rawFile.filename, team)
  const previous = rawFile.previous_filename || (status === 'modified' && rawFile.filename) || '' // eslint-disable-line camelcase
  const {slug: previousSlug} = extractNames(previous, team)
  if (!previousSlug || previousSlug !== slug) {
    return db.Insight.findOne({slug}, '_id').lean().then(i => !i)
  }
  return true
}
