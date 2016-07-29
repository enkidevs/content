# Async Library - Parallel
author: Tom Marshall

levels:

  - basic

  - advanced

  - medium

type: normal

category: must-know

tags: []

inAlgoPool: true

links:

  - nature: website

    name: www.sebastianseilund.com

    url: 'http://www.sebastianseilund.com/nodejs-async-in-practice'

---
## Content

Where the tasks array of functions run in parallel (simultaneously), they don't wait until the previous function is completed.

If any of the functions pass an error to its callback then the main callback is simultaneously called with the value of the error.

Once the tasks have completed, the results are passed to the final callback as an array.

Arguments:
- *tasks* - an array/object containing functions to run. 
- *callback(error, results)* - a callback to run once all the functions have completed successfully. Gets a results array/object containing all result arguments passed to the task callbacks.

```JavaScript
async.parallel([
    function(callback){
        setTimeout(function(){
            callback(null, 'one');
        }, 200);
    };
    function(callback){
        setTimeout(function(){
            callback(null, 'two');
        }, 100);
    }
];
function(err, results){
   // results array = ['one', 'two']
});
```