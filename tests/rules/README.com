# Rules

Each file represent a rule for an insight.

It needs to export a function:
```js
(parsedInsight, {rawFile, db, repo, sha, ref, team}) -> Boolean || Promise
```

* `parsedInsight` - coming from the [parser](../parser.js)
* `rawFile` - coming from [github](https://developer.github.com/v3/repos/commits/#compare-two-commits)
* `db` - map of enki database models. Probably hard to use without insider knowledge
* `repo`, `sha`, `ref`, `team` - information about the commit being tested
