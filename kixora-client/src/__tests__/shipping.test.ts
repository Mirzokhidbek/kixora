import { describe, expect, it } from "vitest";
import { formatAddress, validateShipping, type ShippingForm } from "../app/components/checkout/shipping";

const valid: ShippingForm = { fullName: "Aziz Karimov", phone: "+998 90 123 45 67", address: "Amir Temur 45, Apt 12", city: "Tashkent", postalCode: "100000", note: "" };

describe("shipping form", () => {
  it("accepts a complete address", () => {
    expect(validateShipping(valid)).toBe("");
  });
  it.each([
    ["fullName", "A"],
    ["phone", "call me"],
    ["address", "x"],
    ["city", " "],
  ] as const)("rejects an invalid %s", (field, value) => {
    expect(validateShipping({ ...valid, [field]: value })).not.toBe("");
  });
  it("formats a single address line", () => {
    expect(formatAddress(valid)).toBe("Tashkent, Amir Temur 45, Apt 12, 100000");
    expect(formatAddress({ ...valid, postalCode: "" })).toBe("Tashkent, Amir Temur 45, Apt 12");
  });
});
