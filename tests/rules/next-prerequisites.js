export const context = 'next-prerequisites'
export const description = 'topic-course for course\'s next and prerequisites must exist.'

export default function ({data: {next, prerequisites}, type}, {db}) {
  if (type !== 'subtopic') return true
  const refs = ((next || []).concat(prerequisites || []))
  if (refs.length === 0) return true
  return Promise.all(
    refs.map(r => r.split('-')[0])
        .map(t => db.topic.findOne({ name: new RegExp(`^${t}$`, 'i') }, '_id'))
      ).then((res) => {
        const topics = res.filter(Boolean)
        if (topics.length !== refs.length) return false
        return Promise.all(
          refs.map(r => r.split('-')[1])
              .map((s, i) => db.subtopic.findOne({
                topic: topics[i]._id,
                name: new RegExp(`^${s}$`, 'i')
              }, '_id'
            )))
      }).then((courses) => {
        return courses.filter(Boolean).length === refs.length
      })
}
