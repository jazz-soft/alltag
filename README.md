# alltag
[![npm](https://img.shields.io/npm/v/alltag.svg)](https://www.npmjs.com/package/alltag)
[![npm](https://img.shields.io/npm/dt/alltag.svg)](https://www.npmjs.com/package/alltag)
[![Build Status](https://travis-ci.com/jazz-soft/alltag.svg?branch=master)](https://travis-ci.com/jazz-soft/alltag)
[![Coverage Status](https://coveralls.io/repos/github/jazz-soft/alltag/badge.svg?branch=master)](https://coveralls.io/github/jazz-soft/alltag?branch=master)

## combine query tags into simple logic expressions

I use this script in my own projects at both front-end and back-end side.  
It may fit your needs as well...

Imagine, you have an online movie database,
and want your visitors to be able to write queries like this:  
`(comedy, action) !horror (/batman/, /joker/)`,  
that means the movie should be `comedy` OR `action`, NOT `horror`,
and have the title matching either `/batman/` OR `/joker/`.

**alltag** parses the query into the following object *(say hi to the LISP fans)*:

    [ 'and',
      [ 'or', [ 'tag', '', 'comedy' ], [ 'tag', '', 'action' ] ],
      [ 'not', [ 'tag', '', 'horror' ] ],
      [ 'or', [ 'tag', '', '/batman/' ], [ 'tag', '', '/joker/' ] ]
    ]

and it's up to you how to handle the parse result.

To be continued...
