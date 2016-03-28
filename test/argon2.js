var assert = require('assert');
var describe = require('mocha').describe;
var it = require('mocha').it;
var argon2i = require('../lib/index').argon2i;
var argon2d = require('../lib/index').argon2d;

describe('argon2i', function () {
  describe('hashRaw', function () {
    it('should return correct hash', function (done) {
      var salt = new Buffer('saltsalt');
      var password = new Buffer('password1');
      var expectedHash = '5179f7706253f090137b74004f16355341405aa657ac3ed1e9b5301326778444';
      argon2i.hashRaw(password, salt, function (err, hashOutput) {
        assert.ifError(err);
        assert.equal(hashOutput.toString('hex'), expectedHash);
        done();
      });
    });

    it('should allow changing timeCost', function (done) {
      var salt = new Buffer('saltsalt');
      var password = new Buffer('password1');
      var expectedHash = '188baa8a1acbad59af6d3acfaa8a63b6845e64ac4d95c7be8b29ea9c00e2edcb';
      argon2i.hashRaw(password, salt, { timeCost: 5 }, function (err, hashOutput) {
        assert.ifError(err);
        assert.equal(hashOutput.toString('hex'), expectedHash);
        done();
      });
    });

    it('should allow changing memoryCost', function (done) {
      var salt = new Buffer('saltsalt');
      var password = new Buffer('password1');
      var expectedHash = 'f7b4b5b0c30976cdf3137281a31a0573e0335723882388320069b58b94793fb7';
      argon2i.hashRaw(password, salt, { memoryCost: 1 << 14 }, function (err, hashOutput) {
        assert.ifError(err);
        assert.equal(hashOutput.toString('hex'), expectedHash);
        done();
      });
    });

    it('should allow changing parallelism', function (done) {
      var salt = new Buffer('saltsalt');
      var password = new Buffer('password1');
      var expectedHash = '804a7d9ed278d4125e5bfb710972ad105235227215a3f9e7c2cda304f7d4b81d';
      var options = { memoryCost: 1 << 16, parallelism: 2 };
      argon2i.hashRaw(password, salt, options, function (err, hashOutput) {
        assert.ifError(err);
        assert.equal(hashOutput.toString('hex'), expectedHash);
        done();
      });
    });

    it('should return error codes', function (done) {
      var salt = new Buffer('saltsalt');
      var password = new Buffer('password1');
      var options = { timeCost: 2, memoryCost: 1, parallelism: 1 };
      argon2i.hashRaw(password, salt, options, function (err, hashOutput) {
        assert(err instanceof Error);
        assert.equal(hashOutput, null);
        assert.equal(err.message, 'Memory cost is too small');
        done();
      });
    });

    it('should allow password input of type string', function (done) {
      var salt = new Buffer('saltsalt');
      var password = 'password1';
      var expectedHash = '5179f7706253f090137b74004f16355341405aa657ac3ed1e9b5301326778444';
      argon2i.hashRaw(password, salt, function (err, hashOutput) {
        assert.ifError(err);
        assert.equal(hashOutput.toString('hex'), expectedHash);
        done();
      });
    });
  });

  describe('hash', function () {
    it('should return encoded hash', function (done) {
      var salt = new Buffer('saltsalt');
      var password = new Buffer('password1');
      var expectedEncoding = '$argon2i$v=19$m=4096,t=3,p=1' +
        '$c2FsdHNhbHQ$UXn3cGJT8JATe3QATxY1U0FAWqZXrD7R6bUwEyZ3hEQ';
      argon2i.hash(password, salt, function (err, res) {
        assert.ifError(err);
        assert.equal(res, expectedEncoding);
        done();
      });
    });

    it('should allow password input of type string', function (done) {
      var salt = new Buffer('saltsalt');
      var password = 'password1';
      var expectedHash = '$argon2i$v=19$m=4096,t=3,p=1' +
        '$c2FsdHNhbHQ$UXn3cGJT8JATe3QATxY1U0FAWqZXrD7R6bUwEyZ3hEQ';
      argon2i.hash(password, salt, function (err, hashOutput) {
        assert.ifError(err);
        assert.equal(hashOutput.toString('hex'), expectedHash);
        done();
      });
    });
  });

  describe('verify', function () {
    it('should verify password', function (done) {
      var password = new Buffer('password1');
      var encodedHash = '$argon2i$v=19$m=4096,t=3,p=1' +
        '$c2FsdHNhbHQ$UXn3cGJT8JATe3QATxY1U0FAWqZXrD7R6bUwEyZ3hEQ';
      argon2i.verify(encodedHash, password, function (err) {
        assert.ifError(err);
        done();
      });
    });

    it('should allow password input of type string', function (done) {
      var password = 'password1';
      var encodedHash = '$argon2i$v=19$m=4096,t=3,p=1' +
        '$c2FsdHNhbHQ$UXn3cGJT8JATe3QATxY1U0FAWqZXrD7R6bUwEyZ3hEQ';
      argon2i.verify(encodedHash, password, function (err) {
        assert.ifError(err);
        done();
      });
    });

    it('should reject bad password', function (done) {
      var password = new Buffer('password10');
      var encodedHash = '$argon2i$v=19$m=4096,t=3,p=1' +
        '$c2FsdHNhbHQ$UXn3cGJT8JATe3QATxY1U0FAWqZXrD7R6bUwEyZ3hEQ';
      argon2i.verify(encodedHash, password, function (err, res) {
        assert(err instanceof Error);
        assert.equal(res, null);
        assert.equal(err.message, 'The password does not match the supplied hash');
        done();
      });
    });

    it('should reject undefined hash', function (done) {
      var password = new Buffer('password10');

      argon2i.verify(undefined, password, function (err, res) {
        assert(err instanceof Error);
        assert.equal(res, null);
        assert.equal(err.message, 'Decoding failed');
        done();
      });
    });
  });
});

describe('argon2d', function () {
  describe('hashRaw', function () {
    it('should return correct hash', function (done) {
      var salt = new Buffer('saltsalt');
      var password = new Buffer('password1');
      var expectedHash = '12d8487548a17c7856a26abf640fcdfd5ab0e4f57188292d2ef634299f43fc2f';
      argon2d.hashRaw(password, salt, function (err, hashOutput) {
        assert.ifError(err);
        assert.equal(hashOutput.toString('hex'), expectedHash);
        done();
      });
    });
  });

  it('should allow password input of type string', function (done) {
    var salt = new Buffer('saltsalt');
    var password = 'password1';
    var expectedHash = '12d8487548a17c7856a26abf640fcdfd5ab0e4f57188292d2ef634299f43fc2f';
    argon2d.hashRaw(password, salt, function (err, hashOutput) {
      assert.ifError(err);
      assert.equal(hashOutput.toString('hex'), expectedHash);
      done();
    });
  });
});
