/**
 * Production server for the SPA on Railway (replaces `serve -s dist`).
 *
 * - Serves the built app from ./dist with SPA fallback to index.html.
 * - Proxies /api/* to the backend (API_ORIGIN). The browser therefore talks to a
 *   single site, so the backend's httpOnly auth cookie is a first-party cookie
 *   and is not blocked by Safari / third-party-cookie protections.
 *
 * Env: PORT (set by Railway), API_ORIGIN (backend URL, no trailing slash),
 *      PROXY_SECRET (same value as the backend's, so it can trust the visitor IP).
 * No dependencies: Node's http + fetch only.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), "dist");
const PORT = Number(process.env.PORT) || 8080;
const PROXY_SECRET = process.env.PROXY_SECRET || "";
const API_ORIGIN = (process.env.API_ORIGIN || "https://burak-backend-production.up.railway.app").replace(/\/+$/, "");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
};

// hop-by-hop headers must not be forwarded by a proxy
const HOP_BY_HOP = new Set(["connection", "keep-alive", "transfer-encoding", "upgrade", "proxy-authorization", "te", "trailer", "host", "content-length"]);

async function proxy(req, res) {
  const target = API_ORIGIN + req.url.replace(/^\/api/, "");
  const headers = {};
  for (const [k, v] of Object.entries(req.headers)) if (!HOP_BY_HOP.has(k)) headers[k] = v;
  // The real visitor IP for the backend's rate limits. It is only trusted when
  // signed with PROXY_SECRET (same value on both services); otherwise ignored.
  delete headers["x-client-ip"];
  delete headers["x-proxy-secret"];
  if (PROXY_SECRET) {
    // X-Real-IP / the right-most X-Forwarded-For entry are added by Railway's edge;
    // left-most entries can be sent by the client and are not trusted
    const forwarded = String(req.headers["x-forwarded-for"] || "").split(",").map((v) => v.trim()).filter(Boolean);
    headers["x-client-ip"] = String(req.headers["x-real-ip"] || forwarded.pop() || req.socket.remoteAddress || "");
    headers["x-proxy-secret"] = PROXY_SECRET;
  }

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : Readable.toWeb(req),
      duplex: "half",
      redirect: "manual",
    });
    const out = {};
    upstream.headers.forEach((v, k) => {
      if (!HOP_BY_HOP.has(k) && k !== "set-cookie" && k !== "content-encoding") out[k] = v;
    });
    const cookies = upstream.headers.getSetCookie();
    if (cookies.length) out["set-cookie"] = cookies;
    res.writeHead(upstream.status, out);
    if (upstream.body) Readable.fromWeb(upstream.body).pipe(res);
    else res.end();
  } catch (err) {
    console.error("API proxy error:", err.message);
    res.writeHead(502, { "content-type": "application/json" });
    res.end(JSON.stringify({ code: 502, message: "The store API is temporarily unavailable." }));
  }
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = path.normalize(path.join(DIST, urlPath));
  if (!file.startsWith(DIST)) {
    res.writeHead(400).end();
    return;
  }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, "index.html"); // SPA fallback
  const ext = path.extname(file);
  res.writeHead(200, {
    "content-type": TYPES[ext] || "application/octet-stream",
    // hashed build assets can be cached forever; index.html must always be fresh
    "cache-control": urlPath.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "no-cache",
    "x-content-type-options": "nosniff",
  });
  fs.createReadStream(file).pipe(res);
}

http
  .createServer((req, res) => {
    if (req.url === "/api" || req.url.startsWith("/api/")) return proxy(req, res);
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405).end();
      return;
    }
    serveStatic(req, res);
  })
  .listen(PORT, "0.0.0.0", () => console.log(`KIXORA web on :${PORT}, API → ${API_ORIGIN}`));
