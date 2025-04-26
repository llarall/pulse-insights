/**
 * Calculates the interpolated median of a sorted array.
 * Returns null if the array is empty.
 */
export function calculateInterpolatedMedian(arr: number[]): number | null {
	if (arr.length === 0) return null;

	const sorted = [...arr].sort((a, b) => a - b);
	const N = sorted.length;

	const position = (N - 1) / 2;
	const lowerIndex = Math.floor(position);
	const upperIndex = Math.ceil(position);

	const lowerValue = sorted[lowerIndex];
	const upperValue = sorted[upperIndex];

	if (lowerIndex === upperIndex) {
		return lowerValue;
	}

	const fractionalPart = position - lowerIndex;

	return lowerValue + (upperValue - lowerValue) * fractionalPart;
}

/**
 * Calculates the Tukey interpolated median for a list of numbers.
 *
 * Unlike a normal median, this method adjusts the result when many values
 * are tied at the middle, improving accuracy for small or skewed samples.
 *
 * - Filters out invalid numbers (NaN, 0, negatives).
 * - Optionally restricts to a set of allowed numbers.
 * - If no valid values, returns 0.
 *
 * Tukey's adjustment formula:
 *   adjustedMedian = M + (ng - nl) / (2 * ne)
 *
 * where:
 *   - M = basic median
 *   - nl = count of numbers less than M
 *   - ne = count of numbers equal to M
 *   - ng = count of numbers greater than M
 */
export function calculateTukeyInterpolatedMedian(
	data: number[],
	allowedNumbers?: number[]
): number {
	if (!data.length) return 0;

	const validData = data.filter(
		(num) =>
			!isNaN(num) &&
			num > 0 &&
			(!allowedNumbers || allowedNumbers.includes(num))
	);

	if (validData.length === 0) return 0;

	const sorted = [...validData].sort((a, b) => a - b);

	const midIndex = Math.floor(sorted.length / 2);
	const M =
		sorted.length % 2 === 0
			? (sorted[midIndex - 1] + sorted[midIndex]) / 2
			: sorted[midIndex];

	let nl = 0,
		ne = 0,
		ng = 0;

	for (const num of sorted) {
		if (num < M) nl++;
		else if (num === M) ne++;
		else ng++;
	}

	if (ne !== 0) {
		return M + (ng - nl) / (2 * ne);
	} else {
		return M;
	}
}
