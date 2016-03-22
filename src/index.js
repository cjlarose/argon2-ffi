var argon2 = require('./library');

var timeCost = 3;
var memoryCost = 12; // 2^12 KiB
var parallelism = 1;

var password = new Buffer("password1");
var salt = password;

var hashOutput = new Buffer(32);
var hashLength = 32;

var result = argon2.argon2i_hash_raw(timeCost, memoryCost, parallelism, password, password.length, salt, salt.length, hashOutput, hashLength);
console.log(result);
console.log(hashOutput.toString('hex'));
