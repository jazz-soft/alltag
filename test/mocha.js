var assert = require('assert');
var alltag = require('..');

describe('alltag parser', function() {
  it('empty', function() {
    var x = alltag.parse('');
    assert.equal(x, undefined);
  });
  it('a b', function() {
    var x = alltag.parse(' a \tb ');
    var y = [ 'and', [ 'tag', '', 'a' ], [ 'tag', '', 'b' ] ];
    assert.equal(JSON.stringify(x), JSON.stringify(y));
  });
  it('a, b', function() {
    var x = alltag.parse(' a, b ');
    var y = [ 'or', [ 'tag', '', 'a' ], [ 'tag', '', 'b' ] ];
    assert.equal(JSON.stringify(x), JSON.stringify(y));
  });
  it('!a', function() {
    var x = alltag.parse(' ! !!a ');
    var y = [ 'not', [ 'tag', '', 'a' ] ];
    assert.equal(JSON.stringify(x), JSON.stringify(y));
  });
  it('a (b, c))', function() {
    var x = alltag.parse('a (b, c)');
    var y = [ 'and', [ 'tag', '', 'a' ], [ 'or', [ 'tag', '', 'b' ], [ 'tag', '', 'c' ] ] ];
    assert.equal(JSON.stringify(x), JSON.stringify(y));
  });
  it('_ : +-<=>', function() {
    var x = alltag.parse('_ : +-<=>');
    var y = [ 'tag', '_', '+-<=>' ];
    assert.equal(JSON.stringify(x), JSON.stringify(y));
  });
  it('/\\/\\d+/', function() {
    var x = alltag.parse('/\\/\\d+/');
    var y = [ 'tag', '', '/\\/\\d+/' ];
    assert.equal(JSON.stringify(x), JSON.stringify(y));
  });
  it('/\\/\\d+/i', function() {
    var x = alltag.parse('/\\/\\d+/i');
    var y = [ 'tag', '', '/\\/\\d+/i' ];
    assert.equal(JSON.stringify(x), JSON.stringify(y));
  });
  it('/\\/\\d+/i, x', function() {
    var x = alltag.parse('/\\/\\d+/i, x');
    var y = [ 'or', [ 'tag', '', '/\\/\\d+/i' ], [ 'tag', '', 'x' ] ];
    assert.equal(JSON.stringify(x), JSON.stringify(y));
  });
  it('x : /\\/\\d+/i', function() {
    var x = alltag.parse('x : /\\/\\d+/i');
    var y = [ 'tag', 'x', '/\\/\\d+/i' ];
    assert.equal(JSON.stringify(x), JSON.stringify(y));
  });
  it('1+1', function() {
    var x = alltag.parse('1+1');
    var y = [ 'tag', '', '1+1' ];
    assert.equal(JSON.stringify(x), JSON.stringify(y));
  });
  it('1:+1', function() {
    var x = alltag.parse('1:+1');
    var y = [ 'tag', '1', '+1' ];
    assert.equal(JSON.stringify(x), JSON.stringify(y));
  });
  it('1: - throws', function() {
    assert.throws(function() { alltag.parse('1: '); });
  });
  it('1+:1 - throws', function() {
    assert.throws(function() { alltag.parse('1+:1'); });
  });
  it(': - throws', function() {
    assert.throws(function() { alltag.parse(' : '); });
  });
  it('! - throws', function() {
    assert.throws(function() { alltag.parse(' ! '); });
  });
  it('/ - throws', function() {
    assert.throws(function() { alltag.parse(' / '); });
  });
  it('% - throws', function() {
    assert.throws(function() { alltag.parse(' % '); });
  });
  it('( a - throws', function() {
    assert.throws(function() { alltag.parse('( a'); });
  });
  it('( ) - throws', function() {
    assert.throws(function() { alltag.parse('( )'); });
  });
  it('a ) - throws', function() {
    assert.throws(function() { alltag.parse('a )'); });
  });
  it('a, , b - throws', function() {
    assert.throws(function() { alltag.parse('a, , b'); });
  });
  it('/(/ - throws', function() {
    assert.throws(function() { alltag.parse('/(/'); });
  });
  it('/./_ - throws', function() {
    assert.throws(function() { alltag.parse('/./_'); });
  });
  it('validator - throws', function() {
    assert.throws(function() { alltag.parse('a', function() { throw new Error('Throw it!'); }); });
    assert.throws(function() { alltag.parse('a:b', function() { throw new Error('Throw it!'); }); });
  });
  it('true()', function() {
    assert.equal(JSON.stringify(alltag.true()), JSON.stringify(['true']));
  });
  it('false()', function() {
    assert.equal(JSON.stringify(alltag.false()), JSON.stringify(['false']));
  });
  it('not()', function() {
    assert.equal(JSON.stringify(alltag.not(alltag.false())), JSON.stringify(['true']));
    assert.equal(JSON.stringify(alltag.not(alltag.true())), JSON.stringify(['false']));
    assert.equal(JSON.stringify(alltag.not(alltag.parse('!a, !b'))), JSON.stringify(alltag.parse('a b')));
    assert.equal(JSON.stringify(alltag.not(alltag.parse('!a !b'))), JSON.stringify(alltag.parse('a, b')));
  });
  it('and()', function() {
    var a = alltag.parse('a');
    var t = alltag.true();
    var f = alltag.false();
    assert.equal(JSON.stringify(alltag.and(t, t)), JSON.stringify(t));
    assert.equal(JSON.stringify(alltag.and(t, f)), JSON.stringify(f));
    assert.equal(JSON.stringify(alltag.and(f, t)), JSON.stringify(f));
    assert.equal(JSON.stringify(alltag.and(f, f)), JSON.stringify(f));

    assert.equal(JSON.stringify(alltag.and(t, a)), JSON.stringify(a));
    assert.equal(JSON.stringify(alltag.and(a, t)), JSON.stringify(a));
    assert.equal(JSON.stringify(alltag.and(f, a)), JSON.stringify(f));
    assert.equal(JSON.stringify(alltag.and(a, f)), JSON.stringify(f));

    assert.equal(JSON.stringify(alltag.parse('(a b) (a c)')), JSON.stringify(alltag.parse('a b c')));
    assert.equal(JSON.stringify(alltag.parse('!a !a !a')), JSON.stringify(alltag.parse('!a')));
    assert.equal(JSON.stringify(alltag.parse('a a a')), JSON.stringify(a));
    assert.equal(JSON.stringify(alltag.parse('a !a')), JSON.stringify(f));
    assert.equal(JSON.stringify(alltag.parse('!a b a')), JSON.stringify(f));
    assert.equal(JSON.stringify(alltag.parse('(a b) (c !a)')), JSON.stringify(f));
    assert.equal(JSON.stringify(alltag.parse('(a b) !(a, b)')), JSON.stringify(f));
  });
  it('or()', function() {
    var a = alltag.parse('a');
    var t = alltag.true();
    var f = alltag.false();
    assert.equal(JSON.stringify(alltag.or(t, t)), JSON.stringify(t));
    assert.equal(JSON.stringify(alltag.or(t, f)), JSON.stringify(t));
    assert.equal(JSON.stringify(alltag.or(f, t)), JSON.stringify(t));
    assert.equal(JSON.stringify(alltag.or(f, f)), JSON.stringify(f));

    assert.equal(JSON.stringify(alltag.or(t, a)), JSON.stringify(t));
    assert.equal(JSON.stringify(alltag.or(a, t)), JSON.stringify(t));
    assert.equal(JSON.stringify(alltag.or(f, a)), JSON.stringify(a));
    assert.equal(JSON.stringify(alltag.or(a, f)), JSON.stringify(a));

    assert.equal(JSON.stringify(alltag.parse('(a, b), (a, c)')), JSON.stringify(alltag.parse('a, b, c')));
    assert.equal(JSON.stringify(alltag.parse('!a, !a, !a')), JSON.stringify(alltag.parse('!a')));
    assert.equal(JSON.stringify(alltag.parse('a, a, a')), JSON.stringify(a));
    assert.equal(JSON.stringify(alltag.parse('a, !a')), JSON.stringify(t));
    assert.equal(JSON.stringify(alltag.parse('!a, b, a')), JSON.stringify(t));
    assert.equal(JSON.stringify(alltag.parse('(a, b), (c, !a)')), JSON.stringify(t));
    assert.equal(JSON.stringify(alltag.parse('(a, b), !(a b)')), JSON.stringify(t));
  });
});
