# Parser

The parser returns an AST containing line and column location for each insight item.

[Code](https://github.com/enkidevs/content/blob/master/src/parser.js)

## Format

A node in the AST is in the following format:

```js
{
  name: 'author',
  kind: 'attribute',
  value: 'speedy-gonzales',
  start: {
    line: 1,
    column: 8
  },
  end: {
    line: 1,
    column: 21
  }
}
```

<sub>Note: The term `kind` is used instead of `type` to mean a specific node class. </sub>

AST sample:

```js
{
  kind: 'insight',
  nodes: [{
    name: 'headline',
    kind: 'headline',
    value: 'This is the headline',
    start: {
      line: 0,
      column: 0
    },
    end: {
      line: 0,
      column: 21
    }
  }, {
    name: 'author',
    kind: 'attribute',
    value: 'marvin-the-martian',
    start: {
      line: 1,
      column: 8
    },
    end: {
      line: 1,
      column: 14
    }
  }, {
    name: 'levels',
    kind: 'attribute',
    value: ['basic', 'medium'],
    start: {
      line: 3,
      column: 2
    },
    end: {
      line: 4,
      column: 9
    }
  }, {
    name: 'type',
    kind: 'attribute',
    value: 'normal',
    start: {
      line: 5,
      column: 6
    },
    end: {
      line: 5,
      column: 11
    }
  }, {
    name: 'links',
    kind: 'attribute',
    value: [{
      nature: 'website',
      name: 'name',
      url: 'url'
    }, {
      nature: 'forum',
      name: 'name',
      url: 'url'
    }],
    start: {
      line: 15,
      column: 2
    },
    end: {
      line: 16,
      column: 23
    }
  }, {
    name: 'content',
    kind: 'section',
    value: 'this is the content',
    start: {
      line: 21,
      column: 0
    },
    end: {
      line: 57,
      column: 95
    }
  }]
}
```

## Design

The parser loosely behaves as a combination of a tokenizer and a parser in classical compiler terms.
Its only job is to accumulate all portions of an insight document and only throw errors for invalid syntax.

This means the following document has valid syntax even though it's missing information:

```md
# This is the headline
author:
---
## Content
```

This document would produce the following AST:

```js
{
  kind: 'insight',
  nodes: [{
    name: 'headline',
    kind: 'headline',
    value: 'This is the headline',
    start: {
      line: 0,
      column: 0
    },
    end: {
      line: 0,
      column: 21
    }
  }, {
    name: 'author',
    kind: 'attribute',
    value: null,
    start: {
      line: 1,
      column: 0
    },
    end: {
      line: 1,
      column: 6
    }
  }, {
    name: 'content',
    kind: 'section',
    value: null,
    start: {
      line: 3,
      column: 0
    },
    end: {
      line: 3,
      column: 0
    }
  }]
}
```

The parser also ignores any extra vertical whitespace between insight items, meaning the following is also valid:

```md


# This is the headline


author:


---


## Content


```

The above document would produce a similar AST as the example before it with different values for line and column numbers to account for the extra whitespace.

The line and column numbers for the start and end locations reflect only the content for that specific insight item. This means that the following `author` attribute starts on column 8:

```yaml
author: START
--------^
```

And the following section starts on line 24:

```md
21| ---
22| ## Revision
23|
24| This is the content
```

The [`astToInsight`](https://github.com/enkidevs/content/blob/master/src/parser.js#L295) method converts the AST to an [Enki Insight](https://enkidevs.github.io/guidelines/Insights-guidelines.html).

For example, this tree:

```js
{
  kind: 'insight',
  nodes: [{
    name: 'headline',
    kind: 'headline',
    value: 'This is the headline',
    start: {
      line: 0,
      column: 0
    },
    end: {
      line: 0,
      column: 21
    }
  }, {
    name: 'author',
    kind: 'attribute',
    value: 'pepe-le-pew',
    start: {
      line: 1,
      column: 8
    },
    end: {
      line: 1,
      column: 14
    }
  }, {
    name: 'levels',
    kind: 'attribute',
    value: ['basic', 'medium'],
    start: {
      line: 3,
      column: 2
    },
    end: {
      line: 4,
      column: 9
    }
  }, {
    name: 'type',
    kind: 'attribute',
    value: 'normal',
    start: {
      line: 5,
      column: 6
    },
    end: {
      line: 5,
      column: 11
    }
  }, {
    name: 'links',
    kind: 'attribute',
    value: [{
      nature: 'website',
      name: 'name',
      url: 'url'
    }, {
      nature: 'forum',
      name: 'name',
      url: 'url'
    }],
    start: {
      line: 15,
      column: 2
    },
    end: {
      line: 16,
      column: 23
    }
  }, {
    name: 'content',
    kind: 'section',
    value: 'this is the content',
    start: {
      line: 21,
      column: 0
    },
    end: {
      line: 57,
      column: 95
    }
  }]
}
```

Would be converted to:

```js
{
  headline: "This is the headline",
  author: "pepe-le-pew",
  levels: [
    "basic",
    "medium"
  ],
  type: "normal",
  links: [
    {
      "nature": "website",
      "name": "name",
      "url": "url"
    },
    {
      "nature": "forum",
      "name": "name",
      "url": "url"
    }
  ],
  content: "this is the content"
}
```
