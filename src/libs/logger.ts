import * as Sentry from "@sentry/node";

/**
 * Structured logger.
 * Production: one JSON object per line (level, time, msg, context) — searchable in
 * Railway/any log platform. Development: readable text. Errors also go to Sentry
 * when SENTRY_DSN is configured.
 */
type Level = "debug" | "info" | "warn" | "error";
type Context = Record<string, unknown>;

const isProduction = process.env.NODE_ENV === "production";
let sentryEnabled = false;

function serialize(value: unknown): unknown {
  if (value instanceof Error) return { name: value.name, message: value.message, stack: value.stack };
  return value;
}

function write(level: Level, msg: string, context?: Context) {
  const ctx = context
    ? Object.fromEntries(Object.entries(context).map(([k, v]) => [k, serialize(v)]))
    : undefined;
  const out = level === "error" || level === "warn" ? process.stderr : process.stdout;

  if (isProduction) {
    out.write(JSON.stringify({ level, time: new Date().toISOString(), msg, ...ctx }) + "\n");
  } else {
    const icon = { debug: "·", info: "ℹ", warn: "⚠️", error: "❌" }[level];
    out.write(`${icon} ${msg}${ctx ? " " + JSON.stringify(ctx) : ""}\n`);
  }
}

export const logger = {
  debug: (msg: string, ctx?: Context) => !isProduction && write("debug", msg, ctx),
  info: (msg: string, ctx?: Context) => write("info", msg, ctx),
  warn: (msg: string, ctx?: Context) => write("warn", msg, ctx),
  error: (msg: string, ctx?: Context) => {
    write("error", msg, ctx);
    if (sentryEnabled) {
      const err = ctx?.err instanceof Error ? ctx.err : new Error(msg);
      Sentry.captureException(err, { extra: { msg, ...ctx } });
    }
  },
};

/** Call once at startup. Sentry stays off unless SENTRY_DSN is set. */
export function initMonitoring() {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 0,
    sendDefaultPii: false, // never send cookies, IPs or request bodies
  });
  sentryEnabled = true;
  logger.info("Sentry error monitoring enabled");
}

export async function flushMonitoring() {
  if (sentryEnabled) await Sentry.flush(2000).catch(() => undefined);
}
