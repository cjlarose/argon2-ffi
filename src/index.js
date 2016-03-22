var ffi = require('ffi');
var ref = require('ref');

var argon2 = ffi.Library(__dirname + '/../build/Release/argon2', {
  argon2i_hash_raw: ['int', ['uint32', /* t_cost */
                             'uint32', /* m_cost */
                             'uint32', /* parallelism */
                             ref.refType('void'), /* password */
                             'size_t', /* password length */
                             ref.refType('void'), /* salt */
                             'size_t', /* salt length */
                             ref.refType('void'), /* hash */
                             'size_t']] /* hash length */
});

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
