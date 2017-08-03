import path from 'path'
import fs from 'fs'

function ruleWrapper (fn) {
  return (file, options) => {
    return new Promise((resolve, reject) => {
      try {
        const v = fn(file, options)

        if (v && typeof v.then === 'function') {
          v.then((val) => {
            if (val) {
              return resolve(val)
            }
            reject({file: file.filename})
          }).catch((err) => {
            reject({file: file.filename, err})
          })
          return
        }

        if (v) {
          return resolve(v)
        }
        reject({file: file.filename})
      } catch (err) {
        reject({file: file.filename, err})
      }
    })
  }
}

// Load `*.js` under current directory in an Array
export default fs.readdirSync(path.join(__dirname, '/')).filter((file) => {
  return file.match(/\.js$/) !== null && file !== 'index.js'
}).map((file) => {
  const name = file.replace('.js', '')
  const rule = require('./' + name)
  rule.default = ruleWrapper(rule.default)
  rule.default.context = rule.context
  rule.default.description = rule.description
  rule.default.link = rule.link
  return rule.default
})
