import ref from 'ref-napi';
import {
  argon2ErrorMessage,
  argon2Encodedlen,
  argon2iHashEncoded,
  argon2iHashRaw,
  argon2dHashEncoded,
  argon2dHashRaw,
  argon2iVerify,
  argon2dVerify,
} from './library';

import Promise from 'any-promise';

const ARGON2_OK = 0;
const ARGON2_VERIFY_MISMATCH = -35;

const defaultOptions = {
  timeCost: 3,
  memoryCost: 1 << 12,
  parallelism: 1,
  hashLength: 32,
};

function parseArgs([password, salt, options = {}]) {
  if (typeof password === 'string') { password = new Buffer(password); }
  options = Object.assign({}, defaultOptions, options);

  return [password, salt, options];
}

function variant(hashRaw, hashEncoded, verify) {
  return {
    hashRaw(...args) {
      const [password, salt, options] = parseArgs(args);
      const { timeCost, memoryCost, parallelism, hashLength } = options;
      const hashOutput = new Buffer(hashLength);
      const promise = new Promise((resolve, reject) => {
        const resultHandler = (err, res) => {
          if (err) { return reject(err); }
          if (res !== ARGON2_OK) {
            return reject(new Error(argon2ErrorMessage(res)));
          }
          return resolve(hashOutput);
        };
        hashRaw.async(timeCost, memoryCost, parallelism,
                      password, password.length,
                      salt, salt.length,
                      hashOutput, hashLength,
                      resultHandler);
      });
      return promise;
    },

    hash(...args) {
      const [password, salt, options] = parseArgs(args);
      const { timeCost, memoryCost, parallelism, hashLength } = options;
      const encodedSize = argon2Encodedlen(timeCost, memoryCost, parallelism,
                                                   salt.length, hashLength);
      const outputBuffer = new Buffer(encodedSize);
      const promise = new Promise((resolve, reject) => {
        const resultHandler = (err, res) => {
          if (err) { return reject(err); }
          if (res !== ARGON2_OK) {
            return reject(new Error(argon2ErrorMessage(res)));
          }
          return resolve(ref.readCString(outputBuffer, 0));
        };
        hashEncoded.async(timeCost, memoryCost, parallelism,
                          password, password.length,
                          salt, salt.length,
                          hashLength,
                          outputBuffer, outputBuffer.length,
                          resultHandler);
      });
      return promise;
    },

    verify(encoded, password) {
      const encodedBuffer = ref.allocCString(encoded || '');
      let parsedPassword = password;
      if (typeof password === 'string') { parsedPassword = new Buffer(password); }
      const promise = new Promise((resolve, reject) => {
        const resultHandler = (err, res) => {
          if (err) { return reject(err); }
          if (res === ARGON2_OK) {
            return resolve(true);
          } else if (res === ARGON2_VERIFY_MISMATCH) {
            return resolve(false);
          } else {
            return reject(new Error(argon2ErrorMessage(res)));
          }
        };
        verify.async(encodedBuffer, parsedPassword, parsedPassword.length, resultHandler);
      });
      return promise;
    },
  };
}

export const argon2i = variant(argon2iHashRaw,
                               argon2iHashEncoded,
                               argon2iVerify);
export const argon2d = variant(argon2dHashRaw,
                               argon2dHashEncoded,
                               argon2dVerify);
