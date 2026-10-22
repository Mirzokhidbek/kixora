import { describe, expect, it } from "vitest";
import { calculateCartTotals, DELIVERY_FEE } from "../lib/pricing";

describe("calculateCartTotals (must match the server rule)", () => {
  it("adds the delivery fee below $100", () => {
    expect(calculateCartTotals([{ price: 19.99, quantity: 3 }])).toEqual({ subtotal: 59.97, delivery: DELIVERY_FEE, total: 64.97 });
  });
  it("delivers free from $100", () => {
    expect(calculateCartTotals([{ price: 50, quantity: 2 }])).toEqual({ subtotal: 100, delivery: 0, total: 100 });
  });
  it("charges nothing for an empty cart", () => {
    expect(calculateCartTotals([])).toEqual({ subtotal: 0, delivery: 0, total: 0 });
  });
});
