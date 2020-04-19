interface Argon2Options {
  timeCost?: number;
  memoryCost?: number;
  parallelism?: number;
  hashLength?: number;
}

interface Argon2Variant {
  hashRaw(password: String | Buffer, salt: Buffer, options?: Argon2Options): Promise<Buffer>;
  hash(password: String | Buffer, salt: Buffer, options?: Argon2Options): Promise<String>;
  verify(encoded: String, password: String | Buffer): Promise<boolean>;
}

export const argon2i: Argon2Variant;
export const argon2d: Argon2Variant;
