import { calculateTukeyInterpolatedMedian } from "@/utils/math";
import { describe, expect, it } from "vitest";

describe("calculateTukeyInterpolatedMedian", () => {
	it("returns 0 for empty array", () => {
		expect(calculateTukeyInterpolatedMedian([])).toBe(0);
	});

	it("calculates median with valid numbers", () => {
		expect(calculateTukeyInterpolatedMedian([5, 3, 7])).toBeCloseTo(5, 5);
	});

	it("respects allowedNumbers if provided", () => {
		expect(
			calculateTukeyInterpolatedMedian([1, 2, 3, 4, 5, 6], [1, 2, 3])
		).toBeCloseTo(2, 5);
	});

	it("calculates interpolated median when ne > 0", () => {
		expect(calculateTukeyInterpolatedMedian([2, 2, 3, 3, 4, 4])).toBeCloseTo(
			3,
			5
		);
	});

	it("returns basic median when ne === 0", () => {
		expect(calculateTukeyInterpolatedMedian([1, 2, 3, 5, 6])).toBeCloseTo(3, 5);
	});

	it("ignores 0 and negative values", () => {
		expect(calculateTukeyInterpolatedMedian([-1, 0, 2, 4, 6])).toBeCloseTo(
			4,
			5
		);
	});
});
