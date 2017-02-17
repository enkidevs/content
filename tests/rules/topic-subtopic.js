import yaml from 'js-yaml'
import { extractNames, encodePath } from '../pathUtils'

export const context = 'topic-subtopic'
export const description = 'Existing topic and subtopic'
export const link = 'https://enkidevs.github.io/guidelines/Insights-guidelines.html#topic-m'

export default function (file, {rawFile, repo, sha, team}) {
  const {
    topicName,
    subtopicName
  } = extractNames(rawFile.filename, team)
  return Promise.all([
    repo.getContents(sha, encodePath(topicName) + '/README.md', true),
    repo.getContents(sha, encodePath(topicName) + '/' + encodePath(subtopicName) + '/README.md', true)
  ]).then(([
    {data: topicData},
    {data: subtopicData}
  ]) => {
    try {
      yaml.safeLoad(topicData)
      yaml.safeLoad(subtopicData)
    } catch (err) {
      return false
    }
    return topicData && subtopicData
  })
}
