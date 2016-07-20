# Context manager types - `with`
author: catalin

levels:

  - basic

  - advanced

  - medium

type: normal

category: how to

tags: []

inAlgoPool: true

links:

  - nature: website

    name: preshing.com

    url: 'http://preshing.com/20110920/the-python-with-statement-by-example/'

  - nature: website

    name: docs.python.org

    url: 'https://docs.python.org/3.5/library/stdtypes.html#context-manager-types'

---
## Content

The **context manager** type is Python's way of working with unmanaged resources (e.g. file streams/ databases). aiuwdhaiwudh

 As a result, the `with` keyword is used to ensure resources are **cleaned up** when they are not used any more.

```python
>>> with open('myfile.txt') as f
...   data = f.read()
>>> f.closed
True
```
`with` can be seen as a syntax sugar for the well known `try/catch/finally` block.

To implement a custom **context manager**, two methods must be implemented:

```python
class my_context_manager:
  def __enter__(self):
      # set up things
      return thing
  def __exit__(self,type,value,traceback):
      # deal with unmanaged resources
#....
with my_context_manager as custom_name
   # work with resources

```
When the `with` statement is executed, `__enter__` is called, assigning the returned value to the variable after `as`.

Whatever happens in the code, the `__exit__` method will be called in the end to make sure nothing is left unmanaged. 