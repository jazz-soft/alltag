var assert = require('assert');
var alltag = require('..');

describe('alltag parser', function() {
  it('a b', function() {
    var x = alltag.parse(' a b ');
    var y = [ 'and', [ 'tag', 'a' ], [ 'tag', 'b' ] ];
    assert.equal(JSON.stringify(x), JSON.stringify(y));
  });
  it('a, b', function() {
    var x = alltag.parse(' a, b ');
    var y = [ 'or', [ 'tag', 'a' ], [ 'tag', 'b' ] ];
    assert.equal(JSON.stringify(x), JSON.stringify(y));
  });
  it('!a', function() {
    var x = alltag.parse(' ! !!a ');
    var y = [ 'not', [ 'tag', 'a' ] ];
    assert.equal(JSON.stringify(x), JSON.stringify(y));
  });
  it('a (b, c))', function() {
    var x = alltag.parse('a (b, c)');
    var y = [ 'and', [ 'tag', 'a' ], [ 'or', [ 'tag', 'b' ], [ 'tag', 'c' ] ] ];
    assert.equal(JSON.stringify(x), JSON.stringify(y));
  });
  it('% - throws', function() {
    assert.throws(function() { alltag.parse('%'); });
  });
  it('( a - throws', function() {
    assert.throws(function() { alltag.parse('( a'); });
  });
  it('a ) - throws', function() {
    assert.throws(function() { alltag.parse('a )'); });
  });
});
