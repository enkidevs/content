export const context = 'next-prerequisites'
export const description = 'Course next/prerequisites should follow topic:course slug syntax.'

export default function ({data: {next, prerequisites}, type}, {db}) {
  if (type !== 'subtopic') return true
  const refs = ((next || []).concat(prerequisites || []))
  if (refs.length === 0) return true
  return Promise.all(
    refs.map(entry => entry.split(':')[0])
        .map(topicSlug => db.topic.findOne({ slug: topicSlug }, '_id'))
      ).then((res) => {
        const topics = res.filter(Boolean)
        if (topics.length !== refs.length) return false
        return Promise.all(
          refs.map(entry => entry.split(':')[1])
              .map((subtopicSlug, i) => db.subtopic.findOne({
                topic: topics[i]._id,
                slug: subtopicSlug
              }, '_id'
            )))
      }).then((courses) => courses.filter(Boolean).length === refs.length)
}
