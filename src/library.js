import ffi from 'ffi-napi';
import ref from 'ref-napi';
import path from 'path';
import fs from 'fs';

const RELEASE_DIR = path.join(__dirname, '..', 'build', 'Release');
const LIBRARY_SEARCH_PATHS = [
  path.join(RELEASE_DIR, 'argon2'),
  path.join(RELEASE_DIR, 'obj.target', 'argon2'),
];

function getLibraryPath() {
  const expectedExtensions = ['so', 'dylib', 'dll'];

  for (const searchPath of LIBRARY_SEARCH_PATHS) {
    for (const extension of expectedExtensions) {
      const libraryPath = `${searchPath}.${extension}`;
      if (fs.existsSync(libraryPath) && fs.lstatSync(libraryPath).isFile()) {
        return libraryPath;
      }
    }
  }

  throw new Error('Could not find argon2 library');
}

const lib = new ffi.Library(getLibraryPath(), {
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
