/**
 * E2E harness: starts the real Express app on a random port against an
 * in-memory MongoDB (mongodb-memory-server). Nothing touches Atlas or the
 * repository's upload folder.
 */
import fs from "fs";
import os from "os";
import path from "path";
import type { Server } from "http";
import type { AddressInfo } from "net";

export interface TestEnv {
  baseUrl: string;
  uploadDir: string;
  stop: () => Promise<void>;
}

export async function startTestServer(): Promise<TestEnv> {
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  const mongo = await MongoMemoryServer.create();
  const uploadDir = fs.mkdtempSync(path.join(os.tmpdir(), "kixora-e2e-"));

  // config.ts reads the environment at import time, so set it before importing the app
  Object.assign(process.env, {
    NODE_ENV: "test",
    MONGO_URL: mongo.getUri("kixora_e2e"),
    JWT_SECRET: "e2e-jwt-secret-0123456789abcdef",
    SESSION_SECRET: "e2e-session-secret-0123456789abcdef",
    PAYMENT_MODE: "test",
    UPLOAD_DIR: uploadDir,
    REDIS_URL: "",
  });

  const mongoose = (await import("mongoose")).default;
  mongoose.set("strictQuery", true);
  await mongoose.connect(process.env.MONGO_URL!);
  await mongoose.connection.syncIndexes(); // unique indexes must exist before the tests rely on them
  const app = (await import("../../src/app")).default;

  const server: Server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const { port } = server.address() as AddressInfo;

  return {
    baseUrl: `http://127.0.0.1:${port}`,
    uploadDir,
    stop: async () => {
      await new Promise((r) => server.close(r));
      await mongoose.disconnect();
      await mongo.stop();
      fs.rmSync(uploadDir, { recursive: true, force: true });
    },
  };
}

type Body = { json?: unknown; form?: Record<string, string>; multipart?: FormData };

/** Minimal browser-like HTTP client with a cookie jar */
export class Client {
  private cookies = new Map<string, string>();
  public csrf = "";

  constructor(private readonly base: string) {}

  async req(method: string, url: string, body: Body = {}, headers: Record<string, string> = {}) {
    const h: Record<string, string> = { Accept: "application/json", ...headers };
    if (this.cookies.size) h.Cookie = [...this.cookies].map(([k, v]) => `${k}=${v}`).join("; ");
    if (this.csrf) h["X-CSRF-Token"] = this.csrf;
    let payload: BodyInit | undefined;
    if (body.json !== undefined) {
      h["Content-Type"] = "application/json";
      payload = JSON.stringify(body.json);
    } else if (body.form) {
      payload = new URLSearchParams(body.form);
    } else if (body.multipart) {
      payload = body.multipart;
    }
    const res = await fetch(this.base + url, { method, headers: h, body: payload, redirect: "manual" });
    for (const c of res.headers.getSetCookie()) {
      const [pair] = c.split(";");
      const [k, v] = pair.split("=");
      if (/Max-Age=0|Expires=Thu, 01 Jan 1970/i.test(c) || v === "") this.cookies.delete(k);
      else this.cookies.set(k, v);
    }
    return res;
  }

  get = (url: string, headers?: Record<string, string>) => this.req("GET", url, {}, headers);
  post = (url: string, json?: unknown) => this.req("POST", url, { json: json ?? {} });
  put = (url: string, json?: unknown) => this.req("PUT", url, { json: json ?? {} });
  del = (url: string) => this.req("DELETE", url);

  async json<T = any>(res: Response): Promise<T> {
    return (await res.json()) as T;
  }

  /** Reads the CSRF token the admin pages embed in <meta name="csrf-token"> */
  async loadCsrf(page = "/admin/product/all") {
    const html = await (await this.get(page, { Accept: "text/html" })).text();
    this.csrf = /<meta name="csrf-token" content="([^"]*)"/.exec(html)?.[1] || "";
    return this.csrf;
  }

  hasCookie(name: string) {
    return this.cookies.has(name);
  }

  dropCookie(name: string) {
    this.cookies.delete(name);
  }

  cookie(name: string) {
    return this.cookies.get(name);
  }

  setCookie(name: string, value: string) {
    this.cookies.set(name, value);
  }
}

export const PNG_1PX = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64"
);

export const SHIPPING = { recipient: "E2E Buyer", phone: "+998 90 000 00 00", address: "Tashkent, Test street 1" };
