# `bytearray` objects
author: catalin

levels:

  - basic

  - advanced

  - medium

type: normal

category: feature

tags: []

parent: 56c204a80b57870600f4079f

inAlgoPool: true

links:

  - nature: website

    name: docs.python.org

    url: 'https://docs.python.org/3.5/library/stdtypes.html#bytearray-objects'

---
## Content

The **mutable** counterpart of the `bytes` object is the `bytearray` one. 

Create a `bytearray` object:
```python
b = bytearray() # empty bytearray
b = bytearray(2) # zero-filled of length 2
b = bytearray(range(3))
 # from iterable of integers
```

Just like with the `bytes` object, you can create a `bytearray` object from a **hexadecimal** string:
```python
>>> bytearray.fromhex('2ef0f1f2')
bytearray(b'.\xf0\xf1\xf2')

```

To convert a `bytearray` to a **hexadecimal** string:
```python
>>> bytearray(b'\xf0\xf1\xf2').hex()
'f0f1f2'

```
Because `bytearray` is a **mutable sequence** it supports additional operations such as slicing (`[i:j]`), insertion `b.insert(i,x)` and many others. 