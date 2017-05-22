import fs from 'fs'
import path from 'path'
export default function readSample (name) {
  return fs.readFileSync(
    path.join(process.cwd(), 'tests', '__tests__', 'parser', 'data', `${name}.md`),
    'utf8'
  ).toString()
}
