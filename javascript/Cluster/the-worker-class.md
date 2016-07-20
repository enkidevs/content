# The Worker Class
author: Tom Marshall

levels:

  - basic

  - advanced

  - medium

type: normal

category: hack

tags: []

inAlgoPool: true

links: []

---
## Content

A *worker* object contains all the public information and methods from a worker. 

From the *master*, the object can be obtained using `cluster.workers`. From a *worker*, the object can be obtained using `cluster.worker`.


The *worker* class has many built in functions which can be used to obtain information from the worker.


Each new *worker* is given a unique *workers* *ID*, while the worker is alive, the ID number is the key that indexes it in `cluster.wokers`. To get the ID number:
```javascript
worker.id();
```

To check if a *worker* is connected to its master via its *IPC* channel. The function returns *true* if connected, and *false* if disconnected.
```javascript
if (worker.isConnected()) {
  process.send('Worker connected!'); 
}
```
