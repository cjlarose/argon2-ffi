import argon2 from './library';

/*
const timeCost = 3;
const memoryCost = 12; // 2^12 KiB
const parallelism = 1;

const password = new Buffer('password1');
const salt = password;

const hashOutput = new Buffer(32);
const hashLength = 32;

const result = argon2.argon2i_hash_raw(timeCost, memoryCost, parallelism,
                                       password, password.length,
                                       salt, salt.length,
                                       hashOutput, hashLength);
console.log(result);
console.log(hashOutput.toString('hex'));
*/

const defaultOptions = {
  timeCost: 3,
  memoryCost: 12,
  parallelism: 1,
  hashLength: 32,
};

export const argon2i = {
  hashRaw(...args) {
    let password;
    let salt;
    let options = defaultOptions;
    let cb;

    if (args.length === 3) {
      [password, salt, cb] = args;
    } else {
      [password, salt, options, cb] = args;
    }

    const hashOptions = Object.assign({}, defaultOptions, options);
    const { timeCost, memoryCost, parallelism, hashLength } = hashOptions;
    const hashOutput = new Buffer(hashLength);
    const resultHandler = (err, res) => {
      if (err) { throw err; }
      if (res !== 0) { return cb(res, null); }
      return cb(null, hashOutput);
    };
    argon2.argon2i_hash_raw.async(timeCost, memoryCost, parallelism,
                                  password, password.length,
                                  salt, salt.length,
                                  hashOutput, hashLength,
                                  resultHandler);
    return hashOutput;
  },
};
