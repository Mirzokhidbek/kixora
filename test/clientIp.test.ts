import { test } from "node:test";
import assert from "node:assert/strict";
import type { Request } from "express";

process.env.PROXY_SECRET = "unit-test-proxy-secret";

const fakeReq = (headers: Record<string, string>, ip = "10.0.0.1") => ({ headers, ip, socket: {} }) as unknown as Request;

test("proxy-forwarded client IP is used only with the right secret", async () => {
  const { clientIp } = await import("../src/libs/clientIp");
  assert.equal(clientIp(fakeReq({ "x-client-ip": "1.2.3.4", "x-proxy-secret": "unit-test-proxy-secret" })), "1.2.3.4");
  // spoofed header without (or with a wrong) secret is ignored
  assert.equal(clientIp(fakeReq({ "x-client-ip": "1.2.3.4" })), "10.0.0.1");
  assert.equal(clientIp(fakeReq({ "x-client-ip": "1.2.3.4", "x-proxy-secret": "guess" })), "10.0.0.1");
});
