export default function questionParser (content = '') {
  const lines = content.split('\n')

  // the question source is all of the content except the options
  const src = lines.filter(l => !/^\*/.test(l)).join('\n')

  // replace the gaps with £££ which is very unlikely to be highlighted
  const code = src.replace(/\?\?\?/g, '£££').replace(/___/g, '£££')

  let numberOfGap = 0
  if (/£££/.test(code)) {
    numberOfGap = code.match(/£££/g).length
  } else {
    throw new Error('Question should have some gap (???)')
  }

  // the options starts with `*` on a new line
  let options = lines.filter(l => /^\*/.test(l))
  if (!options.length) {
    throw new Error('Question should have some answers')
  }

  options = options.map(x => x.trim())
    .map(x => x.slice(1))
    .map(x => {
      return {
        src: x
      }
    })

  if (!options.length) {
    throw new Error(
      'Question should have some answers (one per line, starting with *)'
    )
  }
  if (options.length < numberOfGap) {
    throw new Error(
      'Question should have more answers (one per line, starting with *)'
    )
  }

  options = options.map((option, i) => ({
    ...option,
    id: i,
    valid: i < Math.max(numberOfGap, 1) && i // a option is valid if it's in the first ones
  }))

  return {
    src,
    code,
    numberOfGap,
    validOptions: options.filter(o => o.valid !== false),
    options
  }
}
