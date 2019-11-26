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

Valid tag must be a combination of alphanumeric characters `/[a-zA-Z0-9_]/` plus additional characters `/[<>=+-]/`, or be a valid regular expression (in this case, it can contain any characters):

`robin` => `[ 'tag', '', 'robin' ]`  
`/\bburt\s+ward\b/i` => `[ 'tag', '', '/\bburt\s+ward\b/i' ]`  
`1966-1968` => `[ 'tag', '', '1966-1968' ]`

Tags may have an alphanumeric prefix followed by the colon:

`director:/burton/` => `[ 'tag', 'director', '/burton/' ]`

Expressions can be AND-ed by space, OR-ed by a comma, NOT-ed by an exclamation mark, or combined with the brackets:

`(joker, penguin) !catwoman` =>  
`[ 'and', [ 'or', [ 'tag', '', 'joker' ], [ 'tag', '', 'penguin' ] ], [ 'not', [ 'tag', '', 'catwoman' ] ] ]`

To be continued...
