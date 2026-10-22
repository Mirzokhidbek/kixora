import { test } from "node:test";
import assert from "node:assert/strict";
import Errors from "../src/libs/Errors";
import {
  adminReviewReplySchema,
  adminReviewStatusSchema,
  likeSyncSchema,
  parse,
  reviewSaveSchema,
} from "../src/libs/validation";

const ID = "64b000000000000000000001";

test("review: rating must be an integer 1..5", () => {
  assert.equal(parse(reviewSaveSchema, { reviewRating: "4", reviewComment: "Great fit" }).reviewRating, 4);
  for (const bad of [0, 6, 4.5, "x"]) {
    assert.throws(() => parse(reviewSaveSchema, { reviewRating: bad, reviewComment: "Great fit" }), Errors);
  }
});

test("review: comment is trimmed, control chars removed, length enforced", () => {
  const out = parse(reviewSaveSchema, { reviewRating: 5, reviewComment: "  Nice\u0000 shoes\n  " });
  assert.equal(out.reviewComment, "Nice shoes");
  assert.throws(() => parse(reviewSaveSchema, { reviewRating: 5, reviewComment: "  a " }), Errors);
  assert.throws(() => parse(reviewSaveSchema, { reviewRating: 5, reviewComment: "x".repeat(1001) }), Errors);
});

test("review: client cannot set moderation fields", () => {
  const out = parse(reviewSaveSchema, {
    reviewRating: 5,
    reviewComment: "Great fit",
    reviewStatus: "VISIBLE",
    adminReply: "fake store reply",
    memberId: ID,
  });
  assert.deepEqual(Object.keys(out).sort(), ["reviewComment", "reviewRating"]);
});

test("admin moderation inputs are validated", () => {
  assert.throws(() => parse(adminReviewStatusSchema, { reviewStatus: "DELETED" }), Errors);
  assert.equal(parse(adminReviewReplySchema, { adminReply: "  Thanks!  " }).adminReply, "Thanks!");
  assert.equal(parse(adminReviewReplySchema, { adminReply: "" }).adminReply, ""); // removes reply
});

test("like sync accepts only valid ids and is capped", () => {
  assert.deepEqual(parse(likeSyncSchema, { productIds: [ID] }), { productIds: [ID] });
  assert.throws(() => parse(likeSyncSchema, { productIds: ["sample_0"] }), Errors);
  assert.throws(() => parse(likeSyncSchema, { productIds: Array(101).fill(ID) }), Errors);
});
