import { describe, expect, it } from "vitest";
import { getImageUrl } from "../lib/image";
import { serverApi } from "../lib/config";

describe("getImageUrl", () => {
  it("maps stored upload paths to the API", () => {
    expect(getImageUrl("public/uploads/products/a.jpg")).toBe(`${serverApi}/uploads/products/a.jpg`);
  });
  it("keeps bundled static assets local", () => {
    expect(getImageUrl("/img/kixora/logo.png")).toBe("/img/kixora/logo.png");
  });
  it("passes external URLs through", () => {
    expect(getImageUrl("https://cdn.example.com/x.png")).toBe("https://cdn.example.com/x.png");
  });
  it("returns empty string for empty input", () => {
    expect(getImageUrl("")).toBe("");
    expect(getImageUrl(undefined)).toBe("");
  });
});
