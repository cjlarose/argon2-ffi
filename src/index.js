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

var result = argon2.argon2i_hash_raw();
