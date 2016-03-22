{
  "targets": [
    {
      "target_name": "argon2",
      "sources": [
        "libargon2/src/argon2.c",
        "libargon2/src/core.c",
        "libargon2/src/blake2/blake2b.c",
        "libargon2/src/thread.c",
        "libargon2/src/encoding.c",
        "libargon2/src/opt.c"
      ],
      "include_dirs": ["libargon2/include"],
      "cflags": ["-march=native", "-pthread", "-Wno-type-limits"],
      "type": "shared_library"
    }
  ]
}
