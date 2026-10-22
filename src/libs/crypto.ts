import crypto from "crypto";
import { env } from "./config";

/**
 * AES-256-GCM for small secrets stored in the database (admin 2FA keys).
 * Key: DATA_ENCRYPTION_KEY, or derived from JWT_SECRET when not set.
 * Changing the key makes stored 2FA secrets unreadable (admins must re-enroll).
 */
const key = crypto.createHash("sha256").update(process.env.DATA_ENCRYPTION_KEY || `${env.jwtSecret}:data`).digest();

export function encryptSecret(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map((b) => b.toString("base64")).join(".");
}

export function decryptSecret(sealed: string): string {
  const [iv, tag, data] = sealed.split(".").map((p) => Buffer.from(p, "base64"));
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}

/** Constant-time string comparison */
export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}
