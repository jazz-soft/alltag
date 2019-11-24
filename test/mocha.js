﻿var assert = require('assert');
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
});
