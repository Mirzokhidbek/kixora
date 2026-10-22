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

test("order lines never carry a client price", () => {
  const out = parse(orderCreateSchema, [{ productId: ID, itemQuantity: "2", itemPrice: 0 }]);
  assert.deepEqual(out, [{ productId: ID, itemQuantity: 2 }]);
});

test("order lines reject bad ids, zero/huge quantities and empty orders", () => {
  assert.throws(() => parse(orderCreateSchema, [{ productId: "sample_0", itemQuantity: 1 }]), Errors);
  assert.throws(() => parse(orderCreateSchema, [{ productId: ID, itemQuantity: 0 }]), Errors);
  assert.throws(() => parse(orderCreateSchema, [{ productId: ID, itemQuantity: 1000 }]), Errors);
  assert.throws(() => parse(orderCreateSchema, []), Errors);
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
