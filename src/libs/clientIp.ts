import { Request } from "express";
import { env } from "./config";
import { safeEqual } from "./crypto";

/**
 * The visitor's IP for rate limiting.
 * Requests that come through the SPA's /api proxy all arrive from the proxy's IP,
 * so the proxy forwards the real one in X-Client-IP, signed with PROXY_SECRET.
 * Without a matching secret the header is ignored (clients can't spoof it).
 */
export function clientIp(req: Request): string {
  const secret = req.headers["x-proxy-secret"];
  const forwarded = req.headers["x-client-ip"];
  if (env.proxySecret && typeof secret === "string" && typeof forwarded === "string" && safeEqual(secret, env.proxySecret)) {
    return forwarded;
  }
  return req.ip || req.socket.remoteAddress || "unknown";
}
