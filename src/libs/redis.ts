import { createClient } from "redis";
import { logger } from "./logger";

/**
 * Optional shared Redis connection (REDIS_URL).
 * With Redis, rate limits and caches are shared by every server process, so the
 * API can run as several instances. Without it everything falls back to memory.
 */
export type RedisClient = ReturnType<typeof createClient>;

let client: RedisClient | null = null;

export function getRedis(): RedisClient | null {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  if (!client) {
    client = createClient({ url });
    client.on("error", (err) => logger.warn("Redis error", { err: err.message }));
    client.connect().then(
      () => logger.info("Redis connected"),
      (err) => logger.error("Redis connection failed", { err })
    );
  }
  return client;
}

export async function closeRedis() {
  if (client?.isOpen) await client.quit().catch(() => undefined);
}
