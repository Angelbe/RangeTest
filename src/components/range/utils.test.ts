import { describe, expect, it } from "@jest/globals";
import {
  calculatePercentage,
  clampValue,
  formatValue,
  getNearestFixedValue,
} from "./utils";

describe("range utilities", () => {
  it("formats whole and fractional values consistently", () => {
    expect(formatValue(10)).toBe("10");
    expect(formatValue(10.999)).toBe("11");
    expect(formatValue(1.99)).toBe("1.99");
  });

  it("calculates a value's percentage position within a domain", () => {
    expect(calculatePercentage(25, 0, 100)).toBe(25);
    expect(calculatePercentage(5.99, 1.99, 10.99)).toBeCloseTo(44.44);
  });

  it("returns the nearest fixed option and chooses the first on a tie", () => {
    expect(getNearestFixedValue([1.99, 5.99, 10.99], 7)).toBe(5.99);
    expect(getNearestFixedValue([1, 3], 2)).toBe(1);
  });

  it("clamps a value to its inclusive bounds", () => {
    expect(clampValue(-1, 0, 10)).toBe(0);
    expect(clampValue(5, 0, 10)).toBe(5);
    expect(clampValue(11, 0, 10)).toBe(10);
  });
});
