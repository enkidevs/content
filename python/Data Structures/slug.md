# `queue`s and threads
author: null
levels:
  - advanced
  - beginner
type: normal
category: how to
tags: []
parent: 56c5e928bc623a0600ff36fd
inAlgoPool: true
links:
  - nature: website
    name: docs.python.org
    url: 'https://docs.python.org/3.5/library/stdtypes.html#memory-views'
  - nature: website
    name: www.troyfawkes.com
    url: 'http://www.troyfawkes.com/learn-python-multithreading-queues-basics/'

---
## Content

As stated before, the `queue` module provides thread safe `queue` data structures. As a consequence, multiple threads can share the same `queue`.

First we need the modues imported:
```python
from queue import Queue
from threading import Thread
```
Define the worker function:
```python
def enki(q): # queue will be our arg
  while True:
    print q.get()
    q.task_done()
```
`task_done()` tells the queue that I have finished my operation.

Create the threads and the ` queue`:
```python
q = Queue() # queue is created
no_threads = 5 # we will have 5 threads
# threads are created
for i in range(no_threads):
  worker = Thread(target=enki, args=(q,))
  worker.setDaemon(True)
  worker.start()
```

Make the threads work on the same queue:
```python
for x in range(50):
  q.put(x)
# this will only print the numbers 0 - 49
q.join()
```
Using the `join()` method, our program will wait until the queue is empty and threads are done working (info got from `task_done()`).