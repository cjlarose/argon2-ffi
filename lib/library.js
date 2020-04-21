const ffi = require("ffi-napi");
const ref = require("ref-napi");
const path = require("path");
const fs = require("fs");

const RELEASE_DIR = path.join(__dirname, "..", "build", "Release");
const LIBRARY_SEARCH_PATHS = [
  path.join(RELEASE_DIR, "argon2"),
  path.join(RELEASE_DIR, "obj.target", "argon2"),
];

function getLibraryPath() {
  const expectedExtensions = ["so", "dylib", "dll"];

  for (const searchPath of LIBRARY_SEARCH_PATHS) {
    for (const extension of expectedExtensions) {
      const libraryPath = `${searchPath}.${extension}`;
      if (fs.existsSync(libraryPath) && fs.lstatSync(libraryPath).isFile()) {
        return libraryPath;
      }
    }
  }

  throw new Error("Could not find argon2 library");
}

const lib = new ffi.Library(getLibraryPath(), {
  argon2i_hash_encoded: [
    "int",
    [
      "uint32", // t_cost
      "uint32", // m_cost
      "uint32", // p
      ref.refType("void"), // password
      "size_t", // password length
      ref.refType("void"), // salt
      "size_t", // salt length
      "size_t", // hash length
      ref.refType("char"), // output
      "size_t", // output length
    ],
  ],

  argon2i_hash_raw: [
    "int",
    [
      "uint32", // t_cost
      "uint32", // m_cost
      "uint32", // p
      ref.refType("void"), // password
      "size_t", // password length
      ref.refType("void"), // salt
      "size_t", // salt length
      ref.refType("void"), // output
      "size_t", // output length
    ],
  ],

  argon2d_hash_encoded: [
    "int",
    [
      "uint32", // t_cost
      "uint32", // m_cost
      "uint32", // p
      ref.refType("void"), // password
      "size_t", // password length
      ref.refType("void"), // salt
      "size_t", // salt length
      "size_t", // hash length
      ref.refType("char"), // output
      "size_t", // output length
    ],
  ],

  argon2d_hash_raw: [
    "int",
    [
      "uint32", // t_cost
      "uint32", // m_cost
      "uint32", // p
      ref.refType("void"), // password
      "size_t", // password length
      ref.refType("void"), // salt
      "size_t", // salt length
      ref.refType("void"), // output
      "size_t", // output length
    ],
  ],

  argon2i_verify: [
    "int",
    [
      ref.refType("char"), // encoded
      ref.refType("void"), // password
      "size_t", // password length
    ],
  ],

  argon2d_verify: [
    "int",
    [
      ref.refType("char"), // encoded
      ref.refType("void"), // password
      "size_t", // password length
    ],
  ],

  argon2_encodedlen: [
    "size_t",
    [
      "uint32", // t_cost
      "uint32", // m_cost
      "uint32", // p
      "uint32", // salt length
      "uint32", // hash length
    ],
  ],

  argon2_error_message: [
    "string",
    [
      "int", // error_code
    ],
  ],
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

module.exports = {
  argon2ErrorMessage,
  argon2Encodedlen,
  argon2iHashEncoded,
  argon2iHashRaw,
  argon2dHashEncoded,
  argon2dHashRaw,
  argon2iVerify,
  argon2dVerify,
};
