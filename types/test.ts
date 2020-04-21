import { argon2i, argon2d } from "argon2-ffi";

const salt = Buffer.from("saltsalt");
const password = Buffer.from("password1");
const options = { memoryCost: 1 << 16, parallelism: 2 };
const encodedHash =
  "$argon2i$v=19$m=4096,t=3,p=1" +
  "$c2FsdHNhbHQ$UXn3cGJT8JATe3QATxY1U0FAWqZXrD7R6bUwEyZ3hEQ";
argon2i.hash(password, salt);
argon2i.hashRaw(password, salt, { timeCost: 5 });
argon2i.hashRaw(password, salt, { memoryCost: 1 << 14 });
argon2i.hashRaw(password, salt, options);
argon2i.hash(password, salt);
argon2i.verify(encodedHash, password);
argon2d.hashRaw(password, salt);
