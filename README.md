# argon2-ffi [![Build Status](https://travis-ci.org/cjlarose/argon2-ffi.svg?branch=master)](https://travis-ci.org/cjlarose/argon2-ffi)

Node.js bindings for [`argon2`][argon2], the winner of the Password
Hashing Competition (PHC), and the current recommendation for
password storage by the [Open Web Application Security Project
(OWASP)][owasp].

`argon2-ffi` supports Node v4.0 and higher. Calling CPU-intensive tasks like
password hashing and validation are performed asynchronously by dispatching the
work to a separate thread pool using [`node-ffi`, which in turn uses
`libuv`][async-library-calls], so your main application can continue to do
other work while these tasks are executed. All asynchronous operations return
Promises, with a type defined by [any-promise](https://www.npmjs.com/package/any-promise).

[async-library-calls]: https://github.com/node-ffi/node-ffi/wiki/Node-FFI-Tutorial#async-library-calls

## Installation

    npm install --save argon2-ffi

## Usage

This module exports `argon2i` and `argon2d`. These are two variants
of `argon2` with different use-cases and tradeoffs. To find which
one you should use, refer to the [`argon2` repo][argon2].


### Hashing a password

```javascript
var argon2i = require('argon2-ffi').argon2i;
// var argon2d = require('argon2-ffi').argon2d; if you'd like to use argon2d
var crypto = require('crypto');
var Promise = require('bluebird');
var randomBytes = Promise.promisify(crypto.randomBytes);

var password = 'password1'; // Can also be a Buffer
randomBytes(32).then(salt => argon2i.hash(password, salt))
  .then(console.log); // $argon2i$v=19$m=4096,t=3,p=1$c2FsdHlzYWx0$oG0js25z7kM30xSg9+nAKtU0hrPa0UnvRnqQRZXHCV8
```

In this example,
[crypto.randomBytes](https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback)
is used to generate a salt. This is the best practice as the salt is guaranteed
to be cryptographically secure. However, you can of course use your own buffer.

`.hash` takes a few options, too! You can specify `timeCost` (default `3`),
`memoryCost` (default `4096`), `parallelism` (default
`1`), and `hashLength` (default `32`). Changing any of these parameters will
have an effect on the output hash.

```javascript
var argon2i = require('argon2-ffi').argon2i;
var crypto = require('crypto');
var Promise = require('bluebird');
var randomBytes = Promise.promisify(crypto.randomBytes);

var password = new Buffer('password1');
var options = { timeCost: 4, memoryCost: 1 << 14, parallelism: 2, hashLength: 64 };
randomBytes(32).then(salt => argon2i.hash(password, salt, options))
  .then(console.log); // $argon2i$v=19$m=16384,t=4,p=2$c2FsdHlzYWx0$gwJY/FsXNSR3aS1ChVTgDZ9HbF3V7sbbYE5UmQsdXFHB4Tt6/RVtFWGIIJnzZ62nL9miurrvJnxhvORK64ddFg
```

The result of running `.hash` is a string that encodes all of the options used
to produce the hash, so to verify passwords later, this string is all you need,
as we'll see in the next section.

### Verifying a password

```javascript
var argon2i = require('argon2-ffi').argon2i;

var encodedHash = "$argon2i$v=19$m=4096,t=3,p=1$c2FsdHlzYWx0$oG0js25z7kM30xSg9+nAKtU0hrPa0UnvRnqQRZXHCV8";
var password = new Buffer('password1');
argon2i.verify(encodedHash, password)
  .then(correct => console.log(correct ? 'Correct password!' : 'Incorrect password'));
```

### Differences from node-argon2

`argon2-ffi` was originally written to address [an issue][node-argon2-issue]
with running [`node-argon2`][node-argon2] in a web server. This was a
non-starter for my own projects. By using `node-ffi`, `argon2-ffi` was able to
circumvent the problems `node-argon2` had with Promises. `node-argon2` has
since resolved this issue.  `argon2-ffi` also returned Promises with
`any-promise`, but this has since been implemented in `node-argon2` as well.
Today, the practical differences between the two libraries are only in the
public APIs.

[node-argon2-issue]: https://github.com/ranisalt/node-argon2/issues/33
[node-argon2]: https://github.com/ranisalt/node-argon2

## Contributing

To build:

    git submodule init
    git submodule update
    node-gyp rebuild
    npm run build

[argon2]: https://github.com/P-H-C/phc-winner-argon2
[owasp]: https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet
