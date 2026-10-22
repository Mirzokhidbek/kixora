import { test } from "node:test";
import assert from "node:assert/strict";
import { OrderStatus } from "../src/libs/enums/order.enum";
import {
  allowedSourceStatuses,
  calculateTotals,
  canTransition,
  mergeOrderLines,
  mergeOrderLinesBySize,
  pointsForTotal,
} from "../src/libs/orderRules";

test("member may cancel an unpaid order and confirm receipt — nothing else", () => {
  // marking an order as paid is NOT a member action (only a confirmed payment or the admin)
  assert.equal(canTransition(OrderStatus.PAUSE, OrderStatus.PROCESS, "member"), false);
  assert.ok(canTransition(OrderStatus.PAUSE, OrderStatus.DELETE, "member"));
  assert.ok(canTransition(OrderStatus.PROCESS, OrderStatus.FINISH, "member"));

  // skipping payment or re-finishing (points farming) is rejected
  assert.equal(canTransition(OrderStatus.PAUSE, OrderStatus.FINISH, "member"), false);
  assert.equal(canTransition(OrderStatus.FINISH, OrderStatus.FINISH, "member"), false);
  assert.equal(canTransition(OrderStatus.PROCESS, OrderStatus.DELETE, "member"), false);
  assert.equal(canTransition(OrderStatus.DELETE, OrderStatus.PAUSE, "member"), false);
  assert.deepEqual(allowedSourceStatuses(OrderStatus.PAUSE, "member"), []);
});

test("a confirmed payment moves PAUSE → PROCESS and nothing else", () => {
  assert.ok(canTransition(OrderStatus.PAUSE, OrderStatus.PROCESS, "payment"));
  assert.equal(canTransition(OrderStatus.PROCESS, OrderStatus.PROCESS, "payment"), false);
  assert.equal(canTransition(OrderStatus.PAUSE, OrderStatus.FINISH, "payment"), false);
});

test("admin may additionally cancel orders in process", () => {
  assert.ok(canTransition(OrderStatus.PROCESS, OrderStatus.DELETE, "admin"));
  assert.equal(canTransition(OrderStatus.FINISH, OrderStatus.DELETE, "admin"), false);
});

test("totals use given prices, add delivery below $100, and round to cents", () => {
  assert.deepEqual(calculateTotals([{ price: 19.99, quantity: 3 }]), {
    subtotal: 59.97,
    delivery: 5,
    total: 64.97,
  });
  assert.deepEqual(calculateTotals([{ price: 50, quantity: 2 }]), {
    subtotal: 100,
    delivery: 0,
    total: 100,
  });
});

test("loyalty points: 1 point per $10", () => {
  assert.equal(pointsForTotal(64.97), 6);
  assert.equal(pointsForTotal(4), 0);
});

test("duplicate product lines are merged before stock checks", () => {
  assert.deepEqual(
    mergeOrderLines([
      { productId: "a", itemQuantity: 1 },
      { productId: "b", itemQuantity: 2 },
      { productId: "a", itemQuantity: 3 },
    ]),
    [
      { productId: "a", itemQuantity: 4 },
      { productId: "b", itemQuantity: 2 },
    ]
  );
});

test("order lines keep different sizes of one model apart", () => {
  assert.deepEqual(
    mergeOrderLinesBySize([
      { productId: "a", itemQuantity: 1, itemSize: 42 },
      { productId: "a", itemQuantity: 2, itemSize: 43 },
      { productId: "a", itemQuantity: 1, itemSize: 42 },
    ]),
    [
      { productId: "a", itemSize: 42, itemQuantity: 2 },
      { productId: "a", itemSize: 43, itemQuantity: 2 },
    ]
  );
});
