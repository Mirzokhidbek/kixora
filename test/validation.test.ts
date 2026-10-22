import { test } from "node:test";
import assert from "node:assert/strict";
import Errors from "../src/libs/Errors";
import {
  memberUpdateSchema,
  orderCreateSchema,
  parse,
  productInquirySchema,
  signupSchema,
} from "../src/libs/validation";
import { escapeRegex, shapeIntoMongooseObjectId } from "../src/libs/config";

const ID = "64b000000000000000000001";

test("signup strips privileged fields (no self-promotion to admin)", () => {
  const out = parse(signupSchema, {
    memberNick: "alice",
    memberPassword: "secret123",
    memberType: "RESTAURANT",
    memberPoints: 999999,
    memberStatus: "ACTIVE",
  });
  assert.deepEqual(Object.keys(out).sort(), ["memberNick", "memberPassword"]);
});

test("profile update only accepts profile fields", () => {
  const out = parse(memberUpdateSchema, {
    memberNick: "bob",
    memberType: "RESTAURANT",
    memberPoints: 5000,
    memberPassword: "x",
  });
  assert.deepEqual(out, { memberNick: "bob" });
});

const shipping = { recipient: "Aziz Karimov", phone: "+998 90 123 45 67", address: "Tashkent, Amir Temur 45" };
const order = (items: unknown, ship: unknown = shipping) => ({ items, shipping: ship });

test("order lines never carry a client price", () => {
  const out = parse(orderCreateSchema, order([{ productId: ID, itemQuantity: "2", itemPrice: 0, itemSize: "42" }]));
  assert.deepEqual(out.items, [{ productId: ID, itemQuantity: 2, itemSize: 42 }]);
});

test("order lines reject bad ids, zero/huge quantities and empty orders", () => {
  assert.throws(() => parse(orderCreateSchema, order([{ productId: "sample_0", itemQuantity: 1 }])), Errors);
  assert.throws(() => parse(orderCreateSchema, order([{ productId: ID, itemQuantity: 0 }])), Errors);
  assert.throws(() => parse(orderCreateSchema, order([{ productId: ID, itemQuantity: 1000 }])), Errors);
  assert.throws(() => parse(orderCreateSchema, order([])), Errors);
});

test("orders require a usable shipping address", () => {
  const items = [{ productId: ID, itemQuantity: 1 }];
  assert.throws(() => parse(orderCreateSchema, { items }), Errors);
  assert.throws(() => parse(orderCreateSchema, order(items, { ...shipping, phone: "call me" })), Errors);
  assert.throws(() => parse(orderCreateSchema, order(items, { ...shipping, address: "x" })), Errors);
  assert.equal(parse(orderCreateSchema, order(items)).shipping.recipient, "Aziz Karimov");
});

test("product listing: limit is capped and sort field is whitelisted", () => {
  assert.deepEqual(parse(productInquirySchema, {}), { page: 1, limit: 8, order: "createdAt" });
  assert.throws(() => parse(productInquirySchema, { limit: "100000" }), Errors);
  assert.throws(() => parse(productInquirySchema, { order: "memberPassword" }), Errors);
});

test("validation errors are 400s", () => {
  try {
    parse(signupSchema, { memberNick: "a" });
    assert.fail("should throw");
  } catch (err) {
    assert.ok(err instanceof Errors);
    assert.equal(err.code, 400);
  }
});

test("escapeRegex neutralises catastrophic patterns", () => {
  const re = new RegExp(escapeRegex("(a+)+$"));
  assert.ok(re.test("(a+)+$"));
  assert.equal(re.test("aaaa"), false);
});

test("malformed ObjectIds become 400 instead of crashing", () => {
  assert.throws(() => shapeIntoMongooseObjectId("not-an-id"), (e: Errors) => e.code === 400);
  assert.equal(String(shapeIntoMongooseObjectId(ID)), ID);
});
