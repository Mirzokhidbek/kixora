import { describe, expect, it } from "vitest";
import { pointsForTotal, tierFor } from "../lib/loyalty";
import { availableFor } from "../lib/stock";

describe("loyalty", () => {
  it("1 point per $10 (same rule as the server)", () => {
    expect(pointsForTotal(85)).toBe(9);
    expect(pointsForTotal(4)).toBe(0);
  });
  it("tier comes from points, with distance to the next tier", () => {
    expect(tierFor(0)).toEqual({ name: "Member", next: { name: "Silver", pointsNeeded: 100 } });
    expect(tierFor(120).name).toBe("Silver");
    expect(tierFor(2000)).toEqual({ name: "Elite", next: null });
  });
});

describe("availableFor", () => {
  it("uses per-size stock when the product has it", () => {
    const p = { productLeftCount: 3, productSizeStock: [{ size: 40, count: 2 }, { size: 41, count: 0 }] };
    expect(availableFor(p, 40)).toBe(2);
    expect(availableFor(p, 41)).toBe(0);
    expect(availableFor(p, 44)).toBe(0);
  });
  it("falls back to the product total otherwise", () => {
    expect(availableFor({ productLeftCount: 5 }, 42)).toBe(5);
    expect(availableFor({ productLeftCount: -1 }, 42)).toBe(0);
  });
});
