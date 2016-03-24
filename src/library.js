import ffi from 'ffi';
import ref from 'ref';
import path from 'path';

const dylib = path.join(__dirname, '..', 'build', 'Release', 'argon2');
export default new ffi.Library(dylib, {
  argon2i_hash_raw: ['int', ['uint32', 'uint32', 'uint32',    // t_cost, m_cost, p
                             ref.refType('void'), 'size_t',   // password
                             ref.refType('void'), 'size_t',   // salt
                             ref.refType('void'), 'size_t']], // hash output

  argon2i_hash_encoded: ['int', ['uint32', 'uint32', 'uint32',    // t_cost, m_cost, p
                                 ref.refType('void'), 'size_t',   // password
                                 ref.refType('void'), 'size_t',   // salt
                                 'size_t',                        // hash length
                                 ref.refType('char'), 'size_t']], // encoded hash
  argon2i_verify: ['int', [ref.refType('char'), // encoded
                           ref.refType('void'), // password
                           'size_t']],          // password length
  argon2_encodedlen: ['size_t', ['uint32', 'uint32', 'uint32', // t_cost, m_cost, p
                                 'uint32', 'uint32']],         // salt length, hash length
});
