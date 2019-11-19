var assert = require('assert');
var alltag = require('..');

describe('alltag parser', function() {
  it('and', function() {
    var x = alltag.parse(' a b ');
    var y = [ 'and', [ 'tag', 'a' ], [ 'tag', 'b' ] ];
    assert.equal(JSON.stringify(x), JSON.stringify(y));
  });
  it('or', function() {
    var x = alltag.parse(' a, b ');
    var y = [ 'or', [ 'tag', 'a' ], [ 'tag', 'b' ] ];
    assert.equal(JSON.stringify(x), JSON.stringify(y));
  });
  it('not', function() {
    var x = alltag.parse(' ! !!a ');
    var y = [ 'not', [ 'tag', 'a' ] ];
    assert.equal(JSON.stringify(x), JSON.stringify(y));
  });
});
