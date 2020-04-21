const ref = require("ref-napi");
const Promise = require("any-promise");
const {
  argon2ErrorMessage,
  argon2Encodedlen,
  argon2iHashEncoded,
  argon2iHashRaw,
  argon2dHashEncoded,
  argon2dHashRaw,
  argon2iVerify,
  argon2dVerify,
} = require("./library");

const ARGON2_OK = 0;
const ARGON2_VERIFY_MISMATCH = -35;

const defaultOptions = {
  timeCost: 3,
  memoryCost: 4096,
  parallelism: 1,
  hashLength: 32,
};

function parseArgs([password, salt, options = {}]) {
  const passwordBuffer =
    typeof password === "string" ? Buffer.from(password) : password;
  const parsedOptions = { ...defaultOptions, ...options };
  return [passwordBuffer, salt, parsedOptions];
}

function variant(hashRaw, hashEncoded, verify) {
  return {
    hashRaw(...args) {
      const [password, salt, options] = parseArgs(args);
      const { timeCost, memoryCost, parallelism, hashLength } = options;
      const hashOutput = Buffer.alloc(hashLength);
      const promise = new Promise((resolve, reject) => {
        const resultHandler = (err, res) => {
          if (err) {
            return reject(err);
          }
          if (res !== ARGON2_OK) {
            return reject(new Error(argon2ErrorMessage(res)));
          }
          return resolve(hashOutput);
        };
        hashRaw.async(
          timeCost,
          memoryCost,
          parallelism,
          password,
          password.length,
          salt,
          salt.length,
          hashOutput,
          hashLength,
          resultHandler
        );
      });
      return promise;
    },

    hash(...args) {
      const [password, salt, options] = parseArgs(args);
      const { timeCost, memoryCost, parallelism, hashLength } = options;
      const encodedSize = argon2Encodedlen(
        timeCost,
        memoryCost,
        parallelism,
        salt.length,
        hashLength
      );
      const outputBuffer = Buffer.alloc(encodedSize);
      const promise = new Promise((resolve, reject) => {
        const resultHandler = (err, res) => {
          if (err) {
            return reject(err);
          }
          if (res !== ARGON2_OK) {
            return reject(new Error(argon2ErrorMessage(res)));
          }
          return resolve(ref.readCString(outputBuffer, 0));
        };
        hashEncoded.async(
          timeCost,
          memoryCost,
          parallelism,
          password,
          password.length,
          salt,
          salt.length,
          hashLength,
          outputBuffer,
          outputBuffer.length,
          resultHandler
        );
      });
      return promise;
    },

    verify(encoded, password) {
      const encodedBuffer = ref.allocCString(encoded || "");
      let parsedPassword = password;
      if (typeof password === "string") {
        parsedPassword = Buffer.from(password);
      }
      const promise = new Promise((resolve, reject) => {
        const resultHandler = (err, res) => {
          if (err) {
            return reject(err);
          }
          if (res === ARGON2_OK) {
            return resolve(true);
          }
          if (res === ARGON2_VERIFY_MISMATCH) {
            return resolve(false);
          }
          return reject(new Error(argon2ErrorMessage(res)));
        };
        verify.async(
          encodedBuffer,
          parsedPassword,
          parsedPassword.length,
          resultHandler
        );
      });
      return promise;
    },
  };
}

const argon2i = variant(argon2iHashRaw, argon2iHashEncoded, argon2iVerify);
const argon2d = variant(argon2dHashRaw, argon2dHashEncoded, argon2dVerify);

module.exports = {
  argon2i,
  argon2d,
};
