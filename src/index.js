var ffi = require('ffi');
var ref = require('ref');

/*
var libm = ffi.Library('libm', {
    'ceil': [ 'double', [ 'double' ] ]
});
libm.ceil(1.5); // 2
console.log(libm.ceil(1.5));
*/

var argon2 = ffi.Library(__dirname + '/../build/Release/argon2', {
  argon2i_hash_raw: ['int', ['uint32_t', /* t_cost */
                             'uint32_t', /* m_cost */
                             'uint32_t', /* parallelism */
                             ref.refType('void'), /* password */
                             'size_t', /* password length */
                             ref.refType('void'), /* salt */
                             'size_t', /* salt length */
                             ref.refType('void'), /* hash */
                             'size_t']] /* hash length */
});

var result = argon2.argon2i_hash_raw();

// You can also access just functions in the current process by passing a null
// var current = ffi.Library(null, {
//   'atoi': [ 'int', [ 'string' ] ]
//   });
//   current.atoi('1234'); // 1234
