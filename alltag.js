(function(global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  }
  else if (typeof define === 'function' && define.amd) {
    define('alltag', [], factory);
  }
  else {
    if (!global) global = window;
    global.alltag = factory();
  }
})(this, function() {

  function Parser(S) {
    this.S = S;
    this.P = 0;
    this.T = this.getToken();
  }

  function isAlphaNum(c) { return c >= 'A' && c <= 'Z' || c >= 'a' && c <= 'z' || c >= '0' && c <= '9' || c == '_'; } 
  function isExtended(c) { return isAlphaNum(c) || c == '+' || c == '-' || c == '>' || c == '<' || c == '='; } 

  Parser.prototype.getToken = function() {
    var c, j, k, r;
    for (; this.P < this.S.length; this.P++) {
      c = this.S[this.P];
      if (c == ' ' || c == '\t') {
        for (j = this.P + 1; j < this.S.length; j++) {
          c = this.S[j];
          if (c != ' ' && c != '\t') break;
        }
        this.P = j - 1;
      }
      else if (c == '(' || c == ')' || c == '!' || c == ',' || c == ':') {
        r = { p: this.P, s: c, t: c };
        this.P++;
        return r;
      }
      else if (isExtended(c)) {
        k = isAlphaNum(c);
        for (j = this.P + 1; j < this.S.length; j++) {
          c = this.S[j];
          if (isExtended(c)) k = k && isAlphaNum(c);
          else break;
        }
        r = { p: this.P, s: this.S.substring(this.P, j), t: k ? 'A' : 'E' };
        this.P = j;
        return r;
      }
      else if (c == '/') {
        for (j = this.P + 1; j < this.S.length; j++) {
          if (this.S[j] == '/') {
            try {
              r = new RegExp(this.S.substring(this.P + 1, j));
              break;
            }
            catch (err) {/**/}
          }
        }
        if (this.S[j] != '/') {
          throw new Error('Incomplete regular expression: ( ' + this.S.substring(this.P, j) + ' ) at position ' + this.P);
        }
        j++;
        for (k = j; k < this.S.length; k++) {
          c = this.S[k];
          if (!(c >= 'A' && c <= 'Z' || c >= 'a' && c <= 'z' || c >= '0' && c <= '9' || c == '_')) break;
        }
        c = this.S.substring(j, k);
        j = k;
        if (c != '' && c != 'i') {
          throw new Error('Invalid regular expression: ( ' + this.S.substring(this.P, j) + ' ) at position ' + this.P);
        }
        r = { p: this.P, s: this.S.substring(this.P, j), t: 'R' };
        this.P = j;
        return r;
      }
      else throw new Error('Unexpected character: ( ' + c + ' ) at position ' + this.P);
    }
  };

  Parser.prototype.parse = function() {
    if (this.T) {
      var x = this.parseOr();
      if (this.T) this.error();
      return x;
    }
  };

  Parser.prototype.error = function() {
    if (this.T) throw new Error('Unexpected token: ( ' + this.T.s + ' ) at position ' + this.T.p);
    else throw new Error('Unexpected end of the line at position ' + this.S.length);
  };

  Parser.prototype.parseOr = function() {
    if (!this.T) return;
    var a = [];
    var x = this.parseAnd();
    if (!x) this.error();
    a.push(x);
    while (this.T && this.T.t == ',') {
      this.T = this.getToken();
      x = this.parseAnd();
      if (!x) this.error();
      a.push(x);
    }
    if (a.length) {
      if (a.length == 1) return a[0];
      else return ['or'].concat(a);
    }
  };

  Parser.prototype.parseAnd = function() {
    var a = [];
    var x;
    for (x = this.parseUnary(); x; x = this.parseUnary()) {
      a.push(x);
    }
    if (a.length) {
      if (a.length == 1) return a[0];
      else return ['and'].concat(a);
    }
  };

  Parser.prototype.parseUnary = function() {
    var x;
    if (!this.T) return;
    if (this.T.t == '!') {
      this.T = this.getToken();
      x = this.parseUnary();
      if (!x) this.error();
      if (x[0] == 'not') return x[1];
      else return ['not', x];
    }
    else return this.parseAtom();
  };

  Parser.prototype.parseAtom = function() {
    var x, t;
    if (!this.T) return;
    if (this.T.t == 'E') {
      x = ['tag', '', this.T.s];
      this.T = this.getToken();
      return x;
    }
    else if (this.T.t == 'R') {
      x = ['tag', '', this.T.s];
      this.T = this.getToken();
      return x;
    }
    else if (this.T.t == 'A') {
      t = this.T;
      this.T = this.getToken();
      if (this.T && this.T.t == ':') {
        this.T = this.getToken();
        if (this.T && (this.T.t == 'A' || this.T.t == 'E' || this.T.t == 'R')) {
          x = ['tag', t.s, this.T.s];
          this.T = this.getToken();
        }
        else this.error();
      }
      else {
        x = ['tag', '', t.s];
      }
      return x;
    }
    else if (this.T.t == '(') {
      this.T = this.getToken();
      x = this.parseOr();
      if (this.T && this.T.t == ')') this.T = this.getToken();
      else this.error();
      return x;
    }
  };

  return {
    parse: function(s) {
      var parser = new Parser(s);
      return parser.parse();
    }
  };

});