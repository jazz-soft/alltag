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

**alltag** parses the query string into an AST object *(say hi to the LISP fans)*:

    [ 'and',
      [ 'or', [ 'tag', '', 'comedy' ], [ 'tag', '', 'action' ] ],
      [ 'not', [ 'tag', '', 'horror' ] ],
      [ 'or', [ 'tag', '', '/batman/' ], [ 'tag', '', '/joker/' ] ]
    ]

and it's up to you how to handle the result.

### Query syntax

Valid tag must be a combination of alphanumeric characters `/[a-zA-Z0-9_]/` plus some additional characters `/[<>=+-]/`,
or be a valid regular expression (in this case, it may contain any characters):

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
      if (ast[0] == 'true') {
        return true;
      }
      if (ast[0] == 'false') {
        return false;
      }
      if (ast[0] == 'and') {
        for (m = 1; m < ast.length; m++) {
          if (!passes(obj, ast[m])) return false;
        }
        return true;
      }
      if (ast[0] == 'or') {
        for (m = 1; m < ast.length; m++) {
          if (passes(obj, ast[m])) return true;
        }
        return false;
      }
      if (ast[0] == 'not') {
        return !passes(obj, ast[1]);
      }
      if (ast[0] == 'tag') {
        if (ast[2][0] == '/') {
          m = ast[2].match(/^\/(.*)\/([^/]*)$/);
          m = new RegExp(m[1], 'i');  // or: m = new RegExp(m[1], m[2]);
          return !!obj.title.match(m);
        }
        return obj.tags.includes(ast[2]);
      }
    }

#### Additional restrictions:

    // To introduce additional restrictions on the tag values,
    // pass a validator function as a second argument to the parser:
    
    ast = alltag.parse(query, function(s1, p1, s2, p2) { ... });
    
    // where
    // s1 - the string value of the prefix
    // p1 - it's position in the input string
    // s2 - the string value of the tag
    // p2 - it's position in the input string
    // if there is no prefix, s1 = '' and p1 = p2
    // e.g.:
    
    function requirePrefix(s1, p1, s2, p2) {
      if (s1 == '') {
        throw new Error('Prefix required at position ' + p1);
      }
    }
    
    function noRegEx(s1, p1, s2, p2) {
      if (s2[0] == '/') {
        throw new Error('Unexpected RegEx ( ' + s2 + ' ) at position ' + p2);
      }
    }
    
    function validDirection(s1, p1, s2, p2) {
      if (!['north', 'west', 'south', 'east'].includes(s2) {
        throw new Error('Invalid tag ( ' + s2 + ' ) at position ' + p2);
      }
    }

### API

#### alltag.parse(query)

Create logical expression from the string `query`.

#### alltag.parse(query, validate)

Create logical expression from the string `query` with additional restrictions.

#### alltag.not(x)

Return inversion of expression `x`.

#### alltag.and(x, y)

Return logical conjunction of expressions `x` and `y`.

#### alltag.or(x, y)

Return logical disjunction of expressions `x` and `y`.

#### alltag.true()

Return an expression for `TRUE`.

#### alltag.false()

Return an expression for `FALSE`.
