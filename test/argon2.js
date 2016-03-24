var assert = require('assert');
var describe = require('mocha').describe;
var it = require('mocha').it;
var argon2i = require('../lib/index').argon2i;

describe('argon2i', function () {
  describe('hashRaw', function () {
    it('should return correct hash', function (done) {
      var salt = new Buffer('saltsalt');
      var password = new Buffer('password1');
      var expectedHash = 'bac520e3d5029363ef138be2ca001516cead3cb8a541c66d5fbd6dc51ce2932c';
      argon2i.hashRaw(password, salt, function (err, hashOutput) {
        assert.ifError(err);
        assert(hashOutput.equals(new Buffer(expectedHash, 'hex')));
        done();
      });
    });

    it('should allow changing timeCost', function (done) {
      var salt = new Buffer('saltsalt');
      var password = new Buffer('password1');
      var expectedHash = '251da10a21fd0f37b00b9dd35b3764c699c2af837ce38229840c0e3a4b9ebacb';
      argon2i.hashRaw(password, salt, { timeCost: 5 }, function (err, hashOutput) {
        assert.ifError(err);
        assert(hashOutput.equals(new Buffer(expectedHash, 'hex')));
        done();
      });
    });

    it('should allow changing memoryCost', function (done) {
      var salt = new Buffer('saltsalt');
      var password = new Buffer('password1');
      var expectedHash = '8bfcac70948a7928a21e060b898fe7f8c63aa9dc758be3e9ee444ab4078c2662';
      argon2i.hashRaw(password, salt, { memoryCost: 14 }, function (err, hashOutput) {
        assert.ifError(err);
        assert(hashOutput.equals(new Buffer(expectedHash, 'hex')));
        done();
      });
    });

    it('should allow changing parallelism', function (done) {
      var salt = new Buffer('saltsalt');
      var password = new Buffer('password1');
      var expectedHash = '7cd6e35a8f9e31616f73c13d19414cf321a80da1916881906b07f235916ea716';
      var options = { memoryCost: 16, parallelism: 2 };
      argon2i.hashRaw(password, salt, options, function (err, hashOutput) {
        assert.ifError(err);
        assert(hashOutput.equals(new Buffer(expectedHash, 'hex')));
        done();
      });
    });

    it('should return error codes', function (done) {
      var salt = new Buffer('saltsalt');
      var password = new Buffer('password1');
      var options = { parallelism: 2 };
      argon2i.hashRaw(password, salt, options, function (err, hashOutput) {
        assert(err instanceof Error);
        assert.equal(hashOutput, null);
        assert.equal(err.message, 'ARGON2_MEMORY_TOO_LITTLE');
        done();
      });
    });
  });
});
