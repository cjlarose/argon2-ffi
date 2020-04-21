// TypeScript Version: 3.0

interface Argon2Options {
  timeCost?: number;
  memoryCost?: number;
  parallelism?: number;
  hashLength?: number;
}

interface Argon2Variant {
  hashRaw(password: string | Buffer, salt: Buffer, options?: Argon2Options): Promise<Buffer>;
  hash(password: string | Buffer, salt: Buffer, options?: Argon2Options): Promise<string>;
  verify(encoded: string, password: string | Buffer): Promise<boolean>;
}

export const argon2i: Argon2Variant;
export const argon2d: Argon2Variant;
