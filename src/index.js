import argon2 from './library';
import errorCodes from './error_codes';

const defaultOptions = {
  timeCost: 3,
  memoryCost: 12,
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

  const hashOptions = Object.assign({}, defaultOptions, options);
  return [password, salt, hashOptions, cb];
}

export const argon2i = {
  hashRaw(...args) {
    const [password, salt, options, cb] = parseArgs(args);
    const { timeCost, memoryCost, parallelism, hashLength } = options;
    const hashOutput = new Buffer(hashLength);
    const resultHandler = (err, res) => {
      if (err) { return cb(err, null); }
      if (!errorCodes.ARGON2_OK.is(res)) {
        const errorMsg = errorCodes.get(res).key;
        return cb(new Error(errorMsg), null);
      }
      return cb(null, hashOutput);
    };
    argon2.argon2i_hash_raw.async(timeCost, 1 << memoryCost, parallelism,
                                  password, password.length,
                                  salt, salt.length,
                                  hashOutput, hashLength,
                                  resultHandler);
    return hashOutput;
  },
};
