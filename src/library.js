import ffi from 'ffi-napi';
import ref from 'ref-napi';
import path from 'path';

function loadLib(filename, fallback) {
  try {
    require(filename);
    return filename;
  } catch (e) {
    return fallback;
  }
}

const defaultTarget = path.join(__dirname, '..', 'build', 'Release', 'argon2');
const linuxTarget = path.join(__dirname, '..', 'build', 'Release', 'lib.target', 'argon2');
const dylib = loadLib(defaultTarget, linuxTarget);
const lib = new ffi.Library(dylib, {
  argon2i_hash_encoded: ['int', ['uint32', 'uint32', 'uint32',    // t_cost, m_cost, p
                                 ref.refType('void'), 'size_t',   // password
                                 ref.refType('void'), 'size_t',   // salt
                                 'size_t',                        // hash length
                                 ref.refType('char'), 'size_t']], // encoded hash

  argon2i_hash_raw: ['int', ['uint32', 'uint32', 'uint32',    // t_cost, m_cost, p
                             ref.refType('void'), 'size_t',   // password
                             ref.refType('void'), 'size_t',   // salt
                             ref.refType('void'), 'size_t']], // hash output

  argon2d_hash_encoded: ['int', ['uint32', 'uint32', 'uint32',    // t_cost, m_cost, p
                                 ref.refType('void'), 'size_t',   // password
                                 ref.refType('void'), 'size_t',   // salt
                                 'size_t',                        // hash length
                                 ref.refType('char'), 'size_t']], // encoded hash

  argon2d_hash_raw: ['int', ['uint32', 'uint32', 'uint32',    // t_cost, m_cost, p
                             ref.refType('void'), 'size_t',   // password
                             ref.refType('void'), 'size_t',   // salt
                             ref.refType('void'), 'size_t']], // hash output

  argon2i_verify: ['int', [ref.refType('char'), // encoded
                           ref.refType('void'), // password
                           'size_t']],          // password length

  argon2d_verify: ['int', [ref.refType('char'), // encoded
                           ref.refType('void'), // password
                           'size_t']],          // password length

  argon2_encodedlen: ['size_t', ['uint32', 'uint32', 'uint32', // t_cost, m_cost, p
                                 'uint32', 'uint32']],         // salt length, hash length

  argon2_error_message: ['string', ['int']], // error_code
});

const {
  argon2_error_message: argon2ErrorMessage,
  argon2_encodedlen: argon2Encodedlen,
  argon2i_hash_encoded: argon2iHashEncoded,
  argon2i_hash_raw: argon2iHashRaw,
  argon2d_hash_encoded: argon2dHashEncoded,
  argon2d_hash_raw: argon2dHashRaw,
  argon2i_verify: argon2iVerify,
  argon2d_verify: argon2dVerify,
} = lib;

export {
  argon2ErrorMessage,
  argon2Encodedlen,
  argon2iHashEncoded,
  argon2iHashRaw,
  argon2dHashEncoded,
  argon2dHashRaw,
  argon2iVerify,
  argon2dVerify,
};
