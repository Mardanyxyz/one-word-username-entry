// One Word, One Username, One Reward — entry program.
//
// The bounty asks for exactly one thing: our own make.fun username, written
// as a single word to /output/entry.txt and nothing else. A judge then reads
// the word and compares it pairwise against other entrants' handles, so the
// file must hold the handle alone — no explanation, no links, no newline.
//
// The handle below is the account this entry is submitted from. It is short,
// pronounceable, and reads like a name someone would actually wear.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Our own make.fun handle. Ten letters, one word, no spaces or punctuation.
const USERNAME = "mardanyxyz";

// The bounty caps an entry at 30 characters, and the gate rejects anything
// that is not a single word of plain text.
const MAX_LENGTH = 30;

// A single word here means letters and digits only: no spaces, no
// punctuation, no newline, no padding of any kind.
const SINGLE_WORD = /^[A-Za-z0-9]+$/;

function validateUsername(word: string): void {
  if (word.length === 0) {
    throw new Error("username must not be empty");
  }
  if (word.length > MAX_LENGTH) {
    throw new Error(
      `username is ${word.length} characters, over the 30-character limit`,
    );
  }
  if (!SINGLE_WORD.test(word)) {
    throw new Error("username must be a single word of letters and digits");
  }
}

function main(): void {
  validateUsername(USERNAME);

  mkdirSync("/output", { recursive: true });

  // Write the word exactly as-is: no trailing newline, no extra bytes.
  writeFileSync("/output/entry.txt", USERNAME, "utf8");

  // Read it back and refuse to finish unless the file is byte-for-byte
  // identical to the word we meant to write. Comparing raw bytes (not the
  // decoded string) also catches a stray BOM or encoding slip that a string
  // comparison would silently pass.
  const written = readFileSync("/output/entry.txt");
  if (!written.equals(Buffer.from(USERNAME, "utf8"))) {
    throw new Error(
      `entry.txt mismatch: expected ${written.length} bytes to equal ${JSON.stringify(USERNAME)}`,
    );
  }

  console.log(`wrote ${JSON.stringify(USERNAME)} to /output/entry.txt`);
}

main();
