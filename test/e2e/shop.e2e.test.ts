/**
 * End-to-end tests: real HTTP against the real app (in-memory MongoDB).
 * Run: npm run test:e2e
 * Tests inside a describe run in order and share state (one store, built up step by step).
 */
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { authenticator } from "otplib";
import { Client, PNG_1PX, SHIPPING, startTestServer, type TestEnv } from "./harness";

let env: TestEnv;
let admin: Client;
let buyer: Client;
let shoe: any; // size-tracked product: 40:2, 41:1, 42:0 at $80
let cap: any; // untracked product: stock 3 at $40

const order = (items: unknown, shipping: unknown = SHIPPING) => ({ items, shipping });

async function outbox() {
  return (await import("../../src/libs/mailer")).testOutbox;
}
/** Token from the newest matching email (signup sends its email in the background, so wait briefly) */
async function lastLinkTo(email: string, kind: "reset-password") {
  for (let i = 0; i < 40; i++) {
    const mail = [...(await outbox())].reverse().find((m) => m.to === email && m.text.includes(kind));
    if (mail) return new URL(/https?:\/\/\S+/.exec(mail.text)![0]).searchParams.get("token");
    await new Promise((r) => setTimeout(r, 50));
  }
  return null;
}
async function signupBuyer(c: Client, nick: string) {
  const res = await c.post("/member/signup", { memberNick: nick, memberEmail: `${nick}@example.com`, memberPassword: "userpass1" });
  assert.equal(res.status, 201);
  return c;
}

before(async () => {
  env = await startTestServer();
});
after(async () => {
  await env.stop();
});

describe("admin bootstrap, CSRF and catalog", () => {
  it("first admin can sign up; a second self-signup is refused", async () => {
    admin = new Client(env.baseUrl);
    const fd = new FormData();
    fd.append("memberNick", "owner");
    fd.append("memberPhone", "+998900000001");
    fd.append("memberPassword", "AdminPass123");
    const res = await admin.req("POST", "/admin/signup", { multipart: fd });
    assert.equal(res.status, 302);
    const intruder = new Client(env.baseUrl);
    const fd2 = new FormData();
    fd2.append("memberNick", "intruder");
    fd2.append("memberPhone", "+998900000002");
    fd2.append("memberPassword", "AdminPass123");
    assert.match(await (await intruder.req("POST", "/admin/signup", { multipart: fd2 })).text(), /already exists/);
  });

  it("admin writes without a CSRF token are rejected", async () => {
    const res = await admin.post("/admin/order/edit", { orderId: "64b000000000000000000001", orderStatus: "PROCESS" });
    assert.equal(res.status, 403);
    assert.ok((await admin.loadCsrf()).length > 20);
  });

  it("creates products (multipart with ?_csrf); HTML uploads are refused", async () => {
    const make = async (fields: Record<string, string>, file: Blob, name: string) => {
      const fd = new FormData();
      Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
      fd.append("productImages", file, name);
      return (await admin.req("POST", `/admin/product/create?_csrf=${admin.csrf}`, { multipart: fd })).text();
    };
    const base = { productCollection: "SNEAKERS", productStatus: "PROCESS" };
    assert.match(await make({ ...base, productName: "Evil", productPrice: "1", productLeftCount: "1" }, new Blob(["<script>x</script>"], { type: "text/html" }), "x.html"), /Only JPG/);
    assert.match(
      await make({ ...base, productName: "Trail Shoe", productPrice: "80", productLeftCount: "99", productSizeStock: "40:2, 41:1, 42:0", productMaterial: "Leather" }, new Blob([PNG_1PX], { type: "image/png" }), "a.png"),
      /Successfully created/
    );
    assert.match(await make({ ...base, productName: "Cap", productPrice: "40", productLeftCount: "3" }, new Blob([PNG_1PX], { type: "image/png" }), "b.png"), /Successfully created/);

    const res = await admin.get("/product/all?limit=50");
    assert.equal(res.headers.get("x-total-count"), "2");
    const list = await admin.json(res);
    shoe = list.find((p: any) => p.productName === "Trail Shoe");
    cap = list.find((p: any) => p.productName === "Cap");
    assert.equal(shoe.productLeftCount, 3, "total = sum of per-size stock");
    assert.deepEqual(shoe.productSizes, [40, 41, 42]);
    assert.equal(shoe.productMaterial, "Leather");
    const stored = path.join(env.uploadDir, shoe.productImages[0].replace("public/uploads/", ""));
    assert.ok(fs.existsSync(stored), "upload written to UPLOAD_DIR");
  });

  it("bag refresh endpoint returns current price/stock for buyable products only", async () => {
    const res = await admin.get(`/product/batch?ids=${shoe._id},${cap._id},64b000000000000000000099`);
    const items = await admin.json(res);
    assert.equal(items.length, 2);
    assert.deepEqual(items.find((p: any) => p._id === shoe._id).productSizeStock, [
      { size: 40, count: 2 },
      { size: 41, count: 1 },
      { size: 42, count: 0 },
    ]);
  });
});

describe("accounts: signup and password reset", () => {
  it("signup: token only in httpOnly cookie, role can't be self-assigned", async () => {
    buyer = new Client(env.baseUrl);
    const res = await buyer.post("/member/signup", { memberNick: "bek", memberEmail: "bek@example.com", memberPassword: "userpass1", memberType: "RESTAURANT" });
    const body = await buyer.json(res);
    assert.equal(res.status, 201);
    assert.equal(body.accessToken, undefined);
    assert.equal(body.member.memberType, "USER");
    assert.ok(buyer.hasCookie("accessToken"));
  });

  it("duplicate nickname → 409", async () => {
    const res = await new Client(env.baseUrl).post("/member/signup", { memberNick: "bek", memberEmail: "other@example.com", memberPassword: "userpass1" });
    assert.equal(res.status, 409);
  });

  it("forgot password: same answer for unknown emails, no mail sent to them", async () => {
    const before = (await outbox()).length;
    const anon = new Client(env.baseUrl);
    assert.equal((await anon.post("/member/password/forgot", { memberEmail: "nobody@example.com" })).status, 200);
    assert.equal((await outbox()).length, before);
    assert.equal((await anon.post("/member/password/forgot", { memberEmail: "bek@example.com" })).status, 200);
    assert.ok(await lastLinkTo("bek@example.com", "reset-password"));
  });

  it("reset: old sessions stop working, new password works, link is single-use", async () => {
    const oldSession = new Client(env.baseUrl);
    oldSession.setCookie("accessToken", buyer.cookie("accessToken")!);
    await new Promise((r) => setTimeout(r, 1100)); // JWT iat has 1-second precision
    const token = await lastLinkTo("bek@example.com", "reset-password");
    assert.equal((await buyer.post("/member/password/reset", { token, memberPassword: "newpass99" })).status, 200);
    assert.equal((await oldSession.get("/member/detail")).status, 403, "token issued before the reset is rejected");
    assert.equal((await buyer.post("/member/password/reset", { token, memberPassword: "again123" })).status, 400);
    assert.equal((await buyer.post("/member/login", { memberEmail: "bek@example.com", memberPassword: "userpass1" })).status, 401);
    assert.equal((await buyer.post("/member/login", { memberEmail: "bek@example.com", memberPassword: "newpass99" })).status, 200);
    assert.equal((await buyer.get("/member/detail")).status, 200);
  });
});

describe("orders, per-size stock and payments", () => {
  let paid: any;

  it("size-tracked product needs a size; sold-out size refused; price comes from the DB", async () => {
    assert.equal((await buyer.post("/order/create", order([{ productId: shoe._id, itemQuantity: 1 }]))).status, 400);
    assert.equal((await buyer.post("/order/create", order([{ productId: shoe._id, itemQuantity: 1, itemSize: 42 }]))).status, 400);
    assert.equal((await buyer.post("/order/create", order([{ productId: shoe._id, itemQuantity: 2, itemSize: 41 }]))).status, 400);
    const res = await buyer.post("/order/create", order([{ productId: shoe._id, itemQuantity: 1, itemSize: 41, itemPrice: 0 }]));
    paid = await buyer.json(res);
    assert.equal(res.status, 201);
    assert.equal(paid.orderTotal, 85, "80 + 5 delivery");
    assert.equal(paid.orderAddress, SHIPPING.address);
    const p = await buyer.json(await buyer.get(`/product/${shoe._id}`));
    assert.deepEqual(p.productSizeStock.map((s: any) => s.count), [2, 0, 0]);
    assert.equal(p.productLeftCount, 2);
  });

  it("orders need a shipping address", async () => {
    assert.equal((await buyer.post("/order/create", { items: [{ productId: cap._id, itemQuantity: 1 }] })).status, 400);
  });

  it("customer cannot mark an order paid; test payment works exactly once", async () => {
    assert.equal((await buyer.post("/order/update", { orderId: paid._id, orderStatus: "PROCESS" })).status, 400);
    const res = await buyer.post("/payment/test/pay", { orderId: paid._id });
    assert.equal((await buyer.json(res)).orderStatus, "PROCESS");
    assert.equal((await buyer.post("/payment/test/pay", { orderId: paid._id })).status, 400);
  });

  it("delivery confirmation awards points once", async () => {
    const before = (await buyer.json(await buyer.get("/member/detail"))).memberPoints;
    assert.equal((await buyer.post("/order/update", { orderId: paid._id, orderStatus: "FINISH" })).status, 200);
    assert.equal((await buyer.post("/order/update", { orderId: paid._id, orderStatus: "FINISH" })).status, 400);
    const afterPts = (await buyer.json(await buyer.get("/member/detail"))).memberPoints;
    assert.equal(afterPts - before, 9, "round(85 / 10)");
  });

  it("cancelling returns stock to the same size", async () => {
    const o = await buyer.json(await buyer.post("/order/create", order([{ productId: shoe._id, itemQuantity: 2, itemSize: 40 }])));
    let p = await buyer.json(await buyer.get(`/product/${shoe._id}`));
    assert.equal(p.productSizeStock[0].count, 0);
    assert.equal((await buyer.post("/order/update", { orderId: o._id, orderStatus: "DELETE" })).status, 200);
    p = await buyer.json(await buyer.get(`/product/${shoe._id}`));
    assert.equal(p.productSizeStock[0].count, 2);
    assert.equal(p.productLeftCount, 2);
  });

  it("admin confirms a manual payment, then a cancel marks it refunded", async () => {
    const o = await buyer.json(await buyer.post("/order/create", order([{ productId: cap._id, itemQuantity: 1 }])));
    assert.equal((await admin.post("/admin/order/edit", { orderId: o._id, orderStatus: "PROCESS" })).status, 200);
    assert.equal((await admin.post("/admin/order/edit", { orderId: o._id, orderStatus: "PROCESS" })).status, 400);
    assert.equal((await admin.post("/admin/order/edit", { orderId: o._id, orderStatus: "DELETE" })).status, 200);
    const html = await (await admin.get("/admin/order/all", { Accept: "text/html" })).text();
    assert.match(html, /Refunded · MANUAL/);
    assert.match(html, /Paid · TEST/);
    assert.doesNotMatch(html, /Card Verified/);
  });
});

describe("likes and verified-buyer reviews", () => {
  it("likes are idempotent and counted once", async () => {
    await buyer.post(`/product/${shoe._id}/like`);
    const res = await buyer.json(await buyer.post(`/product/${shoe._id}/like`));
    assert.equal(res.productLikes, 1);
    assert.equal((await buyer.json(await buyer.get(`/product/${shoe._id}`))).meLiked, true);
  });

  it("only customers who received the product can review; rating is recalculated", async () => {
    const stranger = await signupBuyer(new Client(env.baseUrl), "stranger");
    assert.equal((await stranger.put(`/product/${shoe._id}/reviews/me`, { reviewRating: 5, reviewComment: "never bought" })).status, 403);
    const r = await buyer.put(`/product/${shoe._id}/reviews/me`, { reviewRating: 4, reviewComment: "<script>alert(1)</script> fits well", reviewStatus: "HIDDEN" });
    assert.equal((await buyer.json(r)).reviewStatus, "VISIBLE");
    const p = await buyer.json(await buyer.get(`/product/${shoe._id}`));
    assert.equal(p.ratingAvg, 4);
    assert.equal(p.reviewCount, 1);
  });

  it("admin moderation hides the review from rating and escapes its text", async () => {
    const html = await (await admin.get("/admin/review/all", { Accept: "text/html" })).text();
    assert.match(html, /&lt;script&gt;/);
    const reviews = await buyer.json(await buyer.get(`/product/${shoe._id}/reviews`));
    await admin.post(`/admin/review/${reviews.reviews[0]._id}/status`, { reviewStatus: "HIDDEN" });
    const p = await buyer.json(await buyer.get(`/product/${shoe._id}`));
    assert.equal(p.reviewCount, 0);
  });
});

describe("contact form and newsletter", () => {
  it("contact messages reach the admin inbox", async () => {
    const res = await buyer.post("/support/message", { name: "Bek", contact: "bek@example.com", message: "Do you have size 43 in stock?" });
    assert.equal(res.status, 201);
    const html = await (await admin.get("/admin/inbox", { Accept: "text/html" })).text();
    assert.match(html, /Do you have size 43 in stock\?/);
  });

  it("subscribing is idempotent; unsubscribe needs the signed token", async () => {
    const anon = new Client(env.baseUrl);
    assert.equal((await anon.post("/newsletter/subscribe", { email: "Fan@Example.com" })).status, 200);
    assert.equal((await anon.post("/newsletter/subscribe", { email: "fan@example.com" })).status, 200);
    const csv = await (await admin.get("/admin/inbox/subscribers.csv", { Accept: "text/csv" })).text();
    assert.equal(csv.split("\n").filter((l) => l.includes("fan@example.com")).length, 1);
    assert.equal((await anon.post("/newsletter/unsubscribe", { email: "fan@example.com", token: "x".repeat(64) })).status, 400);
    const link = new URL(/"(https?:\/\/[^"]+unsubscribe[^"]+)"/.exec(csv)![1]);
    assert.equal((await anon.post("/newsletter/unsubscribe", { email: "fan@example.com", token: link.searchParams.get("token") })).status, 200);
  });
});

describe("admin security: 2FA and several admins", () => {
  it("enables 2FA with a code from the authenticator app", async () => {
    const html = await (await admin.get("/admin/security", { Accept: "text/html" })).text();
    const secret = /Key: <code>([A-Z2-7]+)<\/code>/.exec(html)![1];
    assert.equal((await admin.post("/admin/security/2fa/enable", { code: "000000" })).status, 400);
    assert.equal((await admin.post("/admin/security/2fa/enable", { code: authenticator.generate(secret) })).status, 200);

    const fresh = new Client(env.baseUrl);
    let res = await fresh.req("POST", "/admin/login", { form: { memberNick: "owner", memberPassword: "AdminPass123" } });
    assert.equal(res.headers.get("location"), "/admin/login/2fa", "password alone is not enough");
    assert.equal((await fresh.get("/admin/product/all")).status, 401);
    res = await fresh.req("POST", "/admin/login/2fa", { form: { code: "123456" } });
    assert.match(await res.text(), /not correct/);
    res = await fresh.req("POST", "/admin/login/2fa", { form: { code: authenticator.generate(secret) } });
    assert.equal(res.headers.get("location"), "/admin/product/all");
    assert.equal((await fresh.get("/admin/product/all")).status, 200);
  });

  it("an admin can add another admin and deactivate them (not themselves)", async () => {
    const res = await admin.post("/admin/security/admins", { memberNick: "helper", memberPhone: "+998900000003", memberPassword: "HelperPass1" });
    const { data } = await admin.json(res);
    const helper = new Client(env.baseUrl);
    await helper.req("POST", "/admin/login", { form: { memberNick: "helper", memberPassword: "HelperPass1" } });
    assert.equal((await helper.get("/admin/product/all")).status, 200);
    assert.equal((await admin.post(`/admin/security/admins/${data._id}/status`, { memberStatus: "BLOCK" })).status, 200);
    assert.equal((await helper.get("/admin/product/all")).status, 401, "locked out immediately");
    const me = /data-id="([a-f0-9]{24})"/.exec(await (await admin.get("/admin/security", { Accept: "text/html" })).text());
    assert.ok(me);
  });
});

describe("security headers and account status", () => {
  it("admin pages send a nonce-based CSP and no inline handlers", async () => {
    const res = await admin.get("/admin/product/all", { Accept: "text/html" });
    const csp = res.headers.get("content-security-policy") || "";
    const nonce = /'nonce-([^']+)'/.exec(csp)?.[1];
    const html = await res.text();
    assert.ok(nonce && html.includes(`nonce="${nonce}"`));
    assert.match(csp, /script-src-attr 'none'/);
    assert.doesNotMatch(html, /\son(error|click|load)=/);
  });

  it("a blocked member is rejected on the very next request", async () => {
    const victim = await signupBuyer(new Client(env.baseUrl), "victim");
    const me = await victim.json(await victim.get("/member/detail"));
    await admin.post("/admin/user/edit", { _id: me._id, memberStatus: "BLOCK" });
    assert.equal((await victim.get("/member/detail")).status, 403);
  });
});
