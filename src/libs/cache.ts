import { getRedis } from "./redis";

/**
 * Tiny JSON cache: Redis when configured (shared across instances),
 * otherwise a per-process Map with expiry. Cache failures never break requests.
 */
const memory = new Map<string, { value: string; expiresAt: number }>();
const MEMORY_MAX_ENTRIES = 5000;

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const redis = getRedis();
      let raw: string | null = null;
      if (redis?.isReady) {
        raw = await redis.get(key);
      } else {
        const hit = memory.get(key);
        if (hit && hit.expiresAt > Date.now()) raw = hit.value;
        else if (hit) memory.delete(key);
      }
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    try {
      const raw = JSON.stringify(value);
      const redis = getRedis();
      if (redis?.isReady) {
        await redis.set(key, raw, { EX: ttlSeconds });
      } else {
        if (memory.size >= MEMORY_MAX_ENTRIES) memory.delete(memory.keys().next().value as string);
        memory.set(key, { value: raw, expiresAt: Date.now() + ttlSeconds * 1000 });
      }
    } catch {
      /* ignore */
    }
  },

  async del(key: string): Promise<void> {
    memory.delete(key);
    try {
      const redis = getRedis();
      if (redis?.isReady) await redis.del(key);
    } catch {
      /* ignore */
    }
  },
};
