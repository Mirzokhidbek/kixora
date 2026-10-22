import crypto from "crypto";
import mongoose from "mongoose";
import Errors, { HTTPCode, Message } from "./Errors";

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
  console.warn(`⚠️ ${names[0]} is not set; using a random development secret.`);
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
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "kixora-99964",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
};

export const MORGAN_FORMAT = `:method :url :response-time ms [:status] \n`;

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
