import fs from 'fs'
import path from 'path'

export default function loadMD (name) {
  return fs.readFileSync(
    path.join(process.cwd(), 'src', '__tests__', 'data', `${name}.md`),
    'utf8'
  ).toString()
}
