import ref from 'ref';
import argon2 from './library';

const { argon2_error_message: argon2ErrorMessage } = argon2;
const ARGON2_OK = 0;

const defaultOptions = {
  timeCost: 3,
  memoryCost: 1 << 12,
  parallelism: 1,
  hashLength: 32,
};

function parseArgs(args) {
  let password;
  let salt;
  let options = {};
  let cb;

  if (args.length === 3) {
    [password, salt, cb] = args;
  } else {
    [password, salt, options, cb] = args;
  }

  let parsedPassword = password;
  if (typeof password === 'string') { parsedPassword = new Buffer(password); }

  const hashOptions = Object.assign({}, defaultOptions, options);
  return [parsedPassword, salt, hashOptions, cb];
}

function variant(hashRaw, hashEncoded, verify) {
  return {
    hashRaw(...args) {
      const [password, salt, options, cb] = parseArgs(args);
      const { timeCost, memoryCost, parallelism, hashLength } = options;
      const hashOutput = new Buffer(hashLength);
      const resultHandler = (err, res) => {
        if (err) { return cb(err, null); }
        if (res !== ARGON2_OK) {
          return cb(new Error(argon2ErrorMessage(res)), null);
        }
        return cb(null, hashOutput);
      };
      hashRaw.async(timeCost, memoryCost, parallelism,
                    password, password.length,
                    salt, salt.length,
                    hashOutput, hashLength,
                    resultHandler);
      return hashOutput;
    },

    hash(...args) {
      const [password, salt, options, cb] = parseArgs(args);
      const { timeCost, memoryCost, parallelism, hashLength } = options;
      const encodedSize = argon2.argon2_encodedlen(timeCost, memoryCost, parallelism,
                                                   salt.length, hashLength);
      const outputBuffer = new Buffer(encodedSize);
      const resultHandler = (err, res) => {
        if (err) { return cb(err, null); }
        if (res !== ARGON2_OK) {
          return cb(new Error(argon2ErrorMessage(res)), null);
        }
        return cb(null, ref.readCString(outputBuffer, 0));
      };
      hashEncoded.async(timeCost, memoryCost, parallelism,
                        password, password.length,
                        salt, salt.length,
                        hashLength,
                        outputBuffer, outputBuffer.length,
                        resultHandler);
    },

    verify(encoded, password, cb) {
      const encodedBuffer = ref.allocCString(encoded || '');
      let parsedPassword = password;
      if (typeof password === 'string') { parsedPassword = new Buffer(password); }
      verify.async(encodedBuffer, parsedPassword, parsedPassword.length, (err, res) => {
        if (err) { return cb(err, null); }
        if (res !== ARGON2_OK) {
          return cb(new Error(argon2ErrorMessage(res)), null);
        }
        return cb(null, res);
      });
    },
  };
}

export const argon2i = variant(argon2.argon2i_hash_raw,
                               argon2.argon2i_hash_encoded,
                               argon2.argon2i_verify);
export const argon2d = variant(argon2.argon2d_hash_raw,
                               argon2.argon2d_hash_encoded,
                               argon2.argon2d_verify);
