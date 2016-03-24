# argon2.js [![Build Status](https://travis-ci.org/cjlarose/argon2.js.svg?branch=master)](https://travis-ci.org/cjlarose/argon2.js)

Node.js bindings for [`argon2`][argon2], the winner of the Password
Hashing Competition (PHC), and the current recommendation for
password storage by the [Open Web Application Security Project
(OWASP)][owasp].

## Usage:

This module exports `argon2i` and `argon2d`. These are two variants
of `argon2` with different use-cases and tradeoffs. To find which
one you should use, refer to the [`argon2` repo][argon2].


### Hashing a password

```javascript
var argon2i = require('argon2.js').argon2i;

var password = new Buffer('password1');
var salt = new Buffer('saltysalt');
argon2i.hash(password, salt, function(err, res) {
  console.log(res); // $argon2i$v=19$m=4096,t=3,p=1$c2FsdHlzYWx0$oG0js25z7kM30xSg9+nAKtU0hrPa0UnvRnqQRZXHCV8
});
```

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
