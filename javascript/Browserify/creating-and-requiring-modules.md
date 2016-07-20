# Creating and Requiring Modules
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

    name: www.sitepoint.com

    url: 'http://www.sitepoint.com/getting-started-browserify/'

---
## Content

You can turn functions into modules in *Browserify* to increase usability. You can pass variables into these modules for them to be used in the module's functions.

Creating a module in your application:
```javaScript
// square-numbers.js

// Require the underscore npm module
var _ = require('underscore');

function squareNumbers (list) {
    return _.map(list, function (n) { 
       return n*n; 
    });
}
//export squareNumbers as a module
module.exports = squareNumbers;
```

This module can then be required from other `.js` files:
```javaScript
  // require the local module
  var squareNumbers = require('./square-
                                 numbers');
  var input = [1,2,3,4];
  console.log('Input is:', input);
  console.log('Squared is:', 
               squareNumbers(input));
```