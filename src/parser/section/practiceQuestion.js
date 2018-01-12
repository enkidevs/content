import { NAMES } from '../utils'
import parseQuestion from './question'

export default function parsePracticeQuestion (lines, startLineNum, endLineNum) {
  return {
    ...parseQuestion(lines, startLineNum, endLineNum),
    name: NAMES.PRACTICEQUESTION
  }
}
