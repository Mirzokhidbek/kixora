import crypto from "crypto";
import path from "path";
import mongoose from "mongoose";
import Errors, { HTTPCode, Message } from "./Errors";
import { logger } from "./logger";

/** ENVIRONMENT CONFIGURATION (single source of truth for process.env) **/
const isProduction = process.env.NODE_ENV === "production";

/**
 * Secrets must come from the environment. In production a missing secret is a
 * fatal misconfiguration; in development a random per-process value is used so
 * nothing ever falls back to a guessable hardcoded string.
 */
function requireSecret(...names: string[]): string {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) return value.trim();
  }
  if (isProduction) {
    throw new Error(`Missing required environment variable: ${names[0]}`);
  }
  logger.warn("Secret not set; using a random development value", { variable: names[0] });
  return crypto.randomBytes(32).toString("hex");
}

const devOrigins = [
  "http://localhost:8080",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
];

export const env = {
  isProduction,
  port: Number(process.env.PORT) || 3001,
  mongoUrl:
    process.env.MONGO_URL ||
    process.env.MONGO_DEV ||
    "mongodb://127.0.0.1:27017/burak",
  jwtSecret: requireSecret("JWT_SECRET", "SECRET_TOKEN"),
  sessionSecret: requireSecret("SESSION_SECRET"),
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
    : isProduction
    ? []
    : devOrigins,
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  /**
   * Where uploaded images are written. On Railway point this at a mounted Volume
   * (e.g. /data/uploads) so uploads survive redeploys. URLs stay /uploads/<folder>/<file>.
   */
  uploadDir: path.resolve(process.env.UPLOAD_DIR || "public/uploads"),
  redisUrl: process.env.REDIS_URL || "",
  sentryDsn: process.env.SENTRY_DSN || "",
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "kixora-99964",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  /**
   * "test": a simulated provider confirms payments instantly (no real money).
   * "manual": orders wait until the admin confirms the payment.
   * Defaults to manual in production so test payments are never on by accident.
   */
  paymentMode: (process.env.PAYMENT_MODE === "test" || process.env.PAYMENT_MODE === "manual"
    ? process.env.PAYMENT_MODE
    : isProduction
    ? "manual"
    : "test") as "test" | "manual",
};

/** Access log format: JSON lines in production (no query strings with possible PII), short text in dev */
export const MORGAN_FORMAT = isProduction
  ? '{"level":"info","time":":date[iso]","msg":"http","method":":method","path":":path","status"::status,"ms"::response-time}'
  : ":method :url :response-time ms [:status]";

export const AUTH_TIMER = 24; // 24 hours

export const UPLOAD_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/** Converts a string to ObjectId, rejecting malformed ids with 400 instead of crashing with 500 */
export const shapeIntoMongooseObjectId = (target: any) => {
  if (typeof target !== "string") return target;
  if (!mongoose.Types.ObjectId.isValid(target)) {
    throw new Errors(HTTPCode.BAD_REQUEST, Message.INVALID_ID);
  }
  return new mongoose.Types.ObjectId(target);
};

/** Escapes user text so it can be embedded in a RegExp literally (prevents ReDoS / regex injection) */
export const escapeRegex = (text: string): string =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
