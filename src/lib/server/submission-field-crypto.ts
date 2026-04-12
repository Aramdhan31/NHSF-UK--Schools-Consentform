import "server-only";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const VERSION = "v1";
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

const ENV_KEY = "SUBMISSIONS_ENCRYPTION_KEY";

function loadKey(): Buffer {
  const raw = process.env[ENV_KEY]?.trim();
  if (!raw) {
    throw new Error(
      `${ENV_KEY} is not set. Generate with: openssl rand -base64 32`,
    );
  }

  const tryBase64 = Buffer.from(raw, "base64");
  if (tryBase64.length === KEY_LENGTH) {
    return tryBase64;
  }

  const tryHex = Buffer.from(raw, "hex");
  if (tryHex.length === KEY_LENGTH) {
    return tryHex;
  }

  throw new Error(
    `${ENV_KEY} must decode to exactly ${KEY_LENGTH} bytes (use base64 or hex).`,
  );
}

let cachedKey: Buffer | null = null;

function key(): Buffer {
  if (!cachedKey) {
    cachedKey = loadKey();
  }
  return cachedKey;
}

/**
 * Authenticated encryption (AES-256-GCM). Output is opaque ASCII safe for DB text columns.
 */
export function encryptSubmissionPlaintext(plaintext: string): string {
  const k = key();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, k, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  const enc = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  const payload = Buffer.concat([iv, tag, enc]);
  return `${VERSION}:${payload.toString("base64")}`;
}

export function decryptSubmissionCiphertext(ciphertext: string): string {
  const [ver, b64] = ciphertext.split(":", 2);
  if (ver !== VERSION || !b64) {
    throw new Error("Invalid ciphertext format");
  }

  const buf = Buffer.from(b64, "base64");
  const minLen = IV_LENGTH + AUTH_TAG_LENGTH;
  if (buf.length < minLen) {
    throw new Error("Ciphertext too short");
  }

  const iv = buf.subarray(0, IV_LENGTH);
  const tag = buf.subarray(IV_LENGTH, minLen);
  const enc = buf.subarray(minLen);

  const k = key();
  const decipher = createDecipheriv(ALGORITHM, k, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString(
    "utf8",
  );
}

/** Decrypt without throwing (e.g. legacy rows or tampered data). */
export function tryDecryptSubmissionCiphertext(
  ciphertext: string,
): string | null {
  try {
    return decryptSubmissionCiphertext(ciphertext);
  } catch {
    return null;
  }
}
