var assert = require('assert');
var describe = require('mocha').describe;
var it = require('mocha').it;
var argon2i = require('../lib/index').argon2i;
var argon2d = require('../lib/index').argon2d;

describe('argon2i', function () {
  describe('hashRaw', function () {
    it('should return correct hash', function () {
      var salt = new Buffer('saltsalt');
      var password = new Buffer('password1');
      var expectedHash = '5179f7706253f090137b74004f16355341405aa657ac3ed1e9b5301326778444';
      return argon2i.hashRaw(password, salt)
        .then(hash => assert.equal(hash.toString('hex'), expectedHash));
    });

    it('should allow changing timeCost', function () {
      var salt = new Buffer('saltsalt');
      var password = new Buffer('password1');
      var expectedHash = '188baa8a1acbad59af6d3acfaa8a63b6845e64ac4d95c7be8b29ea9c00e2edcb';
      return argon2i.hashRaw(password, salt, { timeCost: 5 })
        .then(hash => assert.equal(hash.toString('hex'), expectedHash));
    });

    it('should allow changing memoryCost', function () {
      var salt = new Buffer('saltsalt');
      var password = new Buffer('password1');
      var expectedHash = 'f7b4b5b0c30976cdf3137281a31a0573e0335723882388320069b58b94793fb7';
      return argon2i.hashRaw(password, salt, { memoryCost: 1 << 14 })
        .then(hash => assert.equal(hash.toString('hex'), expectedHash));
    });

    it('should allow changing parallelism', function () {
      var salt = new Buffer('saltsalt');
      var password = new Buffer('password1');
      var expectedHash = '804a7d9ed278d4125e5bfb710972ad105235227215a3f9e7c2cda304f7d4b81d';
      var options = { memoryCost: 1 << 16, parallelism: 2 };
      return argon2i.hashRaw(password, salt, options)
        .then(hash => assert.equal(hash.toString('hex'), expectedHash));
    });

    it('should return error codes', function () {
      var salt = new Buffer('saltsalt');
      var password = new Buffer('password1');
      var options = { timeCost: 2, memoryCost: 1, parallelism: 1 };
      return argon2i.hashRaw(password, salt, options)
        .catch(err => err)
        .then(function (err) {
          assert(err instanceof Error);
          assert.equal(err.message, 'Memory cost is too small');
        });
    });

    it('should allow password input of type string', function () {
      var salt = new Buffer('saltsalt');
      var password = 'password1';
      var expectedHash = '5179f7706253f090137b74004f16355341405aa657ac3ed1e9b5301326778444';
      return argon2i.hashRaw(password, salt)
        .then(hash => assert.equal(hash.toString('hex'), expectedHash));
    });
  });

  describe('hash', function () {
    it('should return encoded hash', function () {
      var salt = new Buffer('saltsalt');
      var password = new Buffer('password1');
      var expectedEncoding = '$argon2i$v=19$m=4096,t=3,p=1' +
        '$c2FsdHNhbHQ$UXn3cGJT8JATe3QATxY1U0FAWqZXrD7R6bUwEyZ3hEQ';
      return argon2i.hash(password, salt)
        .then(hash => assert.equal(hash.toString('hex'), expectedEncoding));
    });

    it('should allow password input of type string', function () {
      var salt = new Buffer('saltsalt');
      var password = 'password1';
      var expectedHash = '$argon2i$v=19$m=4096,t=3,p=1' +
        '$c2FsdHNhbHQ$UXn3cGJT8JATe3QATxY1U0FAWqZXrD7R6bUwEyZ3hEQ';
      return argon2i.hash(password, salt)
        .then(hash => assert.equal(hash.toString('hex'), expectedHash));
    });
  });

  describe('verify', function () {
    it('should verify password', function () {
      var password = new Buffer('password1');
      var encodedHash = '$argon2i$v=19$m=4096,t=3,p=1' +
        '$c2FsdHNhbHQ$UXn3cGJT8JATe3QATxY1U0FAWqZXrD7R6bUwEyZ3hEQ';
      return argon2i.verify(encodedHash, password)
        .then(correct => assert(correct));
    });

    it('should allow password input of type string', function () {
      var password = 'password1';
      var encodedHash = '$argon2i$v=19$m=4096,t=3,p=1' +
        '$c2FsdHNhbHQ$UXn3cGJT8JATe3QATxY1U0FAWqZXrD7R6bUwEyZ3hEQ';
      return argon2i.verify(encodedHash, password)
        .then(correct => assert(correct));
    });

    it('should resolve false for a bad password', function () {
      var password = new Buffer('password10');
      var encodedHash = '$argon2i$v=19$m=4096,t=3,p=1' +
        '$c2FsdHNhbHQ$UXn3cGJT8JATe3QATxY1U0FAWqZXrD7R6bUwEyZ3hEQ';
      return argon2i.verify(encodedHash, password)
        .then(correct => assert(!correct));
    });

    it('should reject undefined hash', function () {
      var password = new Buffer('password10');

      return argon2i.verify(undefined, password)
        .catch(err => err)
        .then(err => {
          assert(err instanceof Error);
          assert.equal(err.message, 'Decoding failed');
        });
    });
  });
});

describe('argon2d', function () {
  describe('hashRaw', function () {
    it('should return correct hash', function () {
      var salt = new Buffer('saltsalt');
      var password = new Buffer('password1');
      var expectedHash = '12d8487548a17c7856a26abf640fcdfd5ab0e4f57188292d2ef634299f43fc2f';
      return argon2d.hashRaw(password, salt)
        .then(hash => assert.equal(hash.toString('hex'), expectedHash));
    });
  });

  it('should allow password input of type string', function () {
    var salt = new Buffer('saltsalt');
    var password = 'password1';
    var expectedHash = '12d8487548a17c7856a26abf640fcdfd5ab0e4f57188292d2ef634299f43fc2f';
    return argon2d.hashRaw(password, salt)
      .then(hash => assert.equal(hash.toString('hex'), expectedHash));
  });
});
