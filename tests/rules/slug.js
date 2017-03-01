import { extractNames } from '../pathUtils'

export const context = 'slug'
export const description = 'Slug shouldn\'t already exist'

export default function (file, {db, rawFile, team}) {
  const {slug} = extractNames(rawFile.filename, team)
  const previous = rawFile.previous_filename || (rawFile.status === 'modified' && rawFile.filename) || '' // eslint-disable-line camelcase
  const {slug: previousSlug} = extractNames(previous, team)
  if (!previousSlug || previousSlug !== slug) {
    return db.insight.findOne({slug}, '_id').lean().then(i => !i)
  }
  return true
}
