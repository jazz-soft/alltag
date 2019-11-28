# alltag
[![npm](https://img.shields.io/npm/v/alltag.svg)](https://www.npmjs.com/package/alltag)
[![npm](https://img.shields.io/npm/dt/alltag.svg)](https://www.npmjs.com/package/alltag)
[![Build Status](https://travis-ci.com/jazz-soft/alltag.svg?branch=master)](https://travis-ci.com/jazz-soft/alltag)
[![Coverage Status](https://coveralls.io/repos/github/jazz-soft/alltag/badge.svg?branch=master)](https://coveralls.io/github/jazz-soft/alltag?branch=master)

## combine query tags into simple logic expressions

I use this script in my own projects at both the front-end and the back-end. It may suit your needs as well...

Imagine, you have an online movie database,
and want your visitors to be able to write queries like this:

`(comedy, action) !horror (/batman/, /joker/)`,

that means the movie should be `comedy` OR `action`, NOT `horror`,
and have the title matching either `/batman/` OR `/joker/`.

**alltag** parses the query into the AST object *(say hi to the LISP fans)*:

    [ 'and',
      [ 'or', [ 'tag', '', 'comedy' ], [ 'tag', '', 'action' ] ],
      [ 'not', [ 'tag', '', 'horror' ] ],
      [ 'or', [ 'tag', '', '/batman/' ], [ 'tag', '', '/joker/' ] ]
    ]

and it's up to you how to handle the result.

### Query syntax

Valid tag must be a combination of alphanumeric characters `/[a-zA-Z0-9_]/` plus some additional characters `/[<>=+-]/`,
or be a valid regular expression (in this case, it can contain any characters):

`robin` => `[ 'tag', '', 'robin' ]`  
`/\bburt\s+ward\b/i` => `[ 'tag', '', '/\\bburt\\s+ward\\b/i' ]`  
`1966-1968` => `[ 'tag', '', '1966-1968' ]`

Tags may have an alphanumeric prefix followed by the colon:

`director:/burton|nolan/` => `[ 'tag', 'director', '/burton|nolan/' ]`

Expressions can be AND-ed by a space, OR-ed by a comma, NOT-ed by an exclamation mark, or combined with the brackets:

`(joker, penguin) !catwoman` =>  
`[ 'and', [ 'or', [ 'tag', '', 'joker' ], [ 'tag', '', 'penguin' ] ], [ 'not', [ 'tag', '', 'catwoman' ] ] ]`

### Install

`npm install alltag --save`  
or clone it from the [`Github`](https://github.com/jazz-soft/alltag)

### Usage

#### Front end:

    <script src="alltag.js"></script>
    // ...
    var query = ...
    try {
      var ast = alltag.parse(query);
      // ...
    }
    catch (err) { alert(err.message); }

#### Back end:

    var alltag = require('alltag');
    // ...
    var query = ...
    try {
      var ast = alltag.parse(query);
      // ...
    }
    catch (err) { console.log(err.message); }

#### Testing the objects:

    // The actual test will depend on your object's structure,
    // but the overall logic will be the same.
    
    function passes(obj, ast) {
      var m;
      if (ast[0] == 'and') {
        for (m = 1; m < ast.length; m++) if (!passes(obj, ast[m])) return false;
        return true;
      }
      if (ast[0] == 'or') {
        for (m = 1; m < ast.length; m++) if (passes(obj, ast[m])) return true;
        return false;
      }
      if (ast[0] == 'not') return !passes(obj, ast[1]);
      if (ast[0] == 'tag') {
        if (ast[2][0] == '/') {
          m = ast[2].match(/^\/(.*)\/([^/]*)$/);
          m = new RegExp(m[1], 'i');  // or: m = new RegExp(m[1], m[2]);
          return !!obj.title.match(m);
        }
        return obj.tags.includes(ast[2]);
      }
    }
