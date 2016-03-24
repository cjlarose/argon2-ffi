# argon2.js [![Build Status](https://travis-ci.org/cjlarose/argon2.js.svg?branch=master)](https://travis-ci.org/cjlarose/argon2.js)

Node.js bindings for [`argon2`][argon2], the winner of the Password
Hashing Competition (PHC), and the current recommendation for
password storage by the [Open Web Application Security Project
(OWASP)][owasp].

`argon2.js` supports Node v4.0 and higher. Calling CPU-intensive tasks like
password hashing and validation are performed asynchronously by dispatching the
work to a separate thread pool using [`node-ffi`, which in turn uses
`libuv`][async-library-calls], so your main application can continue to do
other work while these tasks are executed.

[async-library-calls]: https://github.com/node-ffi/node-ffi/wiki/Node-FFI-Tutorial#async-library-calls

## Installation

    npm install --save cjlarose/argon2.js

## Usage

This module exports `argon2i` and `argon2d`. These are two variants
of `argon2` with different use-cases and tradeoffs. To find which
one you should use, refer to the [`argon2` repo][argon2].


### Hashing a password

```javascript
var argon2i = require('argon2.js').argon2i;
// var argon2d = require('argon2.js').argon2d; if you'd like to use argon2d

var password = new Buffer('password1');
var salt = new Buffer('saltysalt');
argon2i.hash(password, salt, function(err, res) {
  console.log(res); // $argon2i$v=19$m=4096,t=3,p=1$c2FsdHlzYWx0$oG0js25z7kM30xSg9+nAKtU0hrPa0UnvRnqQRZXHCV8
});
```

`.hash` takes a few options, too! You can specify `timeCost` (default `3`),
`memoryCost` (default `12`, meaning 2<sup>12</sup> KiB), `parallelism` (default
`1`), and `hashLength` (default `32`). Changing any of these parameters will
have an effect on the output hash.

```javascript
var argon2i = require('argon2.js').argon2i;

var password = new Buffer('password1');
var salt = new Buffer('saltysalt');
var options = { timeCost: 4, memoryCost: 14, parallelism: 2, hashLength: 64 };
argon2i.hash(password, salt, options, function(err, res) {
  console.log(res); // $argon2i$v=19$m=16384,t=4,p=2$c2FsdHlzYWx0$gwJY/FsXNSR3aS1ChVTgDZ9HbF3V7sbbYE5UmQsdXFHB4Tt6/RVtFWGIIJnzZ62nL9miurrvJnxhvORK64ddFg
});
```

The result of running `.hash` is a string that encodes all of the options used
to produce the hash, so to verify passwords later, this string is all you need,
as we'll see in the next section.

### Verifying a password


```javascript
var argon2i = require('argon2.js').argon2i;

var encodedHash = "$argon2i$v=19$m=4096,t=3,p=1$c2FsdHlzYWx0$oG0js25z7kM30xSg9+nAKtU0hrPa0UnvRnqQRZXHCV8";
var password = new Buffer('password1');
argon2i.verify(encodedHash, password, function(err, res) {
  if (err) {
    console.error('Incorrect password');
    return;
  }
  console.log('Correct password!');
});
```

## Contributing

To build:

    npm install -g node-gyp
    node-gyp rebuild
    npm run build

[argon2]: https://github.com/P-H-C/phc-winner-argon2
[owasp]: https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet
