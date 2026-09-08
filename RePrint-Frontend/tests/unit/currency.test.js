import { describe, expect, it } from "vitest";
import { formatRand } from "../../src/currencyReprint";

describe("formatRand", () => {
  it("prepends the Rand symbol and formats to two decimals", () => {
    const result = formatRand(100);
    expect(result).toContain("R");
    expect(result).toMatch(/1\s?00[,.]00$/);
  });

  it("handles a decimal value", () => {
    const result = formatRand(100.5);
    expect(result).toMatch(/100[,.]50$/);
  });

  it("returns an em dash for null", () => {
    expect(formatRand(null)).toBe("—");
  });

  it("returns an em dash for undefined", () => {
    expect(formatRand(undefined)).toBe("—");
  });
});
