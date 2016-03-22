var assert = require('assert');
var describe = require('mocha').describe;
var it = require('mocha').it;
var argon2i = require('../lib/index').argon2i;

describe('argon2i', function () {
  describe('hashRaw', function () {
    it('should return correct hash', function () {
      var salt = new Buffer('saltsalt');
      var password = new Buffer('password1');
      var hashOutput = argon2i.hashRaw(password, salt);

      var expectedHash = 'bac520e3d5029363ef138be2ca001516cead3cb8a541c66d5fbd6dc51ce2932c';
      assert(hashOutput.equals(new Buffer(expectedHash, 'hex')));
    });
  });
});
