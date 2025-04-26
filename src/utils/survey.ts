import type {
	TCourse,
	TGroupedSurveyStats,
	TRankedSurveyStats,
	TSurveyQuestionKeys,
	TSurveySummary,
} from "@/types/shared";
import { PULSE_QUESTIONS } from "../constants/surveyQuestions";
import { calculateTukeyInterpolatedMedian } from "./math";

/**
 * Retrieves the array of responses for a given question text from a course.
 */
export const getResponsesForQuestion = (
	responses: TCourse["responses"],
	questionKey: TSurveyQuestionKeys
): number[] => {
	return responses[questionKey] ?? [];
};

/**
 * Calculates median stats for each question,
 * grouping students by responses to `baseKey` (default = question7),
 * using a column-oriented input (Record<questionKey, number[]>).
 */
export const calculateGroupedSurveyStatsFromColumns = (
	responses: Record<TSurveyQuestionKeys, number[]>,
	baseKey: TSurveyQuestionKeys = "question7"
): TGroupedSurveyStats[] => {
	const isValid = (n: number): boolean =>
		typeof n === "number" && !isNaN(n) && n > 0 && n <= 6;

	const baseResponses = responses[baseKey];
	const repFiltered = baseResponses.map((n) => (isValid(n) ? n : null));
	const repValid = repFiltered.filter((n): n is number => n !== null);
	const repMedian = calculateTukeyInterpolatedMedian(repValid);

	// Prebuild group index sets
	const lowRepIndices = new Set<number>();
	const highRepIndices = new Set<number>();

	repFiltered.forEach((val, i) => {
		if (val === null) return;
		if (val <= repMedian!) lowRepIndices.add(i);
		else highRepIndices.add(i);
	});

	const questionKeys = Object.keys(responses) as TSurveyQuestionKeys[];

	return questionKeys.map((questionKey) => {
		const values = responses[questionKey];
		const all = values.filter(isValid);
		const lowRep = Array.from(lowRepIndices)
			.map((i) => values[i])
			.filter(isValid);
		const highRep = Array.from(highRepIndices)
			.map((i) => values[i])
			.filter(isValid);

		return {
			questionKey,
			overallMedian: calculateTukeyInterpolatedMedian(all),
			lowRepMedian: calculateTukeyInterpolatedMedian(lowRep),
			highRepMedian: calculateTukeyInterpolatedMedian(highRep),
			n: all.length,
			lowRepN: lowRep.length,
			highRepN: highRep.length,
		};
	});
};

/**
 * Assigns rankings to survey questions based on a provided value function.
 * Higher values get lower (better) ranks. Equal values get the same rank.
 */
export const rankBy = (
	values: TGroupedSurveyStats[],
	getValue: (s: TGroupedSurveyStats) => number | null
): Map<TSurveyQuestionKeys, number> => {
	const sorted = [...values]
		.filter((s) => getValue(s) !== null)
		.sort((a, b) => getValue(b)! - getValue(a)!);

	const ranks = new Map<TSurveyQuestionKeys, number>();

	let currentRank = 1;
	let previousValue: number | null = null;
	let tieCount = 0;

	for (let i = 0; i < sorted.length; i++) {
		const currentValue = getValue(sorted[i])!;

		if (previousValue !== null) {
			if (currentValue === previousValue) {
				tieCount++;
			} else {
				currentRank += tieCount + 1;
				tieCount = 0;
			}
		}

		ranks.set(sorted[i].questionKey, currentRank);

		previousValue = currentValue;
	}

	return ranks;
};

/**
 * Applies ranking to all survey questions based on their overall, low-rep, and high-rep medians.
 * Returns enriched survey stats including rank fields.
 */
export const rankGroupedStats = (
	stats: TGroupedSurveyStats[]
): TRankedSurveyStats[] => {
	const overallRanks = rankBy(stats, (s) => s.overallMedian);
	const lowRepRanks = rankBy(stats, (s) => s.lowRepMedian);
	const highRepRanks = rankBy(stats, (s) => s.highRepMedian);

	return stats.map((s) => ({
		...s,
		rank: overallRanks.get(s.questionKey) ?? 0,
		lowRepRank: lowRepRanks.get(s.questionKey) ?? 0,
		highRepRank: highRepRanks.get(s.questionKey) ?? 0,
	}));
};

/**
 * Returns boolean is the questionKey provided is a known pulse question
 */
export const isPulseQuestion = (questionKey: TSurveyQuestionKeys) =>
	PULSE_QUESTIONS.includes(questionKey);

/**
 * Calculates key summary statistics from a list of ranked survey stats.
 *
 * Computes:
 * - Percentage of questions where LowRep students responded less favorably
 * - Percentage where HighRep students responded less favorably
 * - Percentage where responses were the same
 * - Top 2 questions with largest median differences
 * - Top 2 questions with largest rank differences
 * - Average LowRep median
 * - Average HighRep median
 */
export const calculateSummaryStats = (
	stats: TRankedSurveyStats[]
): TSurveySummary => {
	const total = stats.length;

	let lowRepLess = 0;
	let highRepLess = 0;
	let same = 0;

	let lowRepSum = 0;
	let highRepSum = 0;

	const medianDifferences = [];
	const rankDifferences = [];

	for (const stat of stats) {
		const { lowRepMedian, highRepMedian, lowRepRank, highRepRank } = stat;

		if (lowRepMedian < highRepMedian) lowRepLess++;
		else if (highRepMedian < lowRepMedian) highRepLess++;
		else same++;

		lowRepSum += lowRepMedian;
		highRepSum += highRepMedian;

		medianDifferences.push({
			questionKey: stat.questionKey,
			difference: Math.abs(highRepMedian - lowRepMedian),
			lowRepMedian,
			highRepMedian,
		});

		rankDifferences.push({
			questionKey: stat.questionKey,
			rankDifference: Math.abs(highRepRank - lowRepRank),
			lowRepRank,
			highRepRank,
		});
	}

	medianDifferences.sort((a, b) => b.difference - a.difference);
	rankDifferences.sort((a, b) => b.rankDifference - a.rankDifference);

	return {
		lowRepLessFavorablePct: total ? (lowRepLess / total) * 100 : 0,
		highRepLessFavorablePct: total ? (highRepLess / total) * 100 : 0,
		sameResponsePct: total ? (same / total) * 100 : 0,
		topMedianDifferences: medianDifferences.slice(0, 2),
		topRankDifferences: rankDifferences.slice(0, 2),
		averageLowRepMedian: total ? lowRepSum / total : 0,
		averageHighRepMedian: total ? highRepSum / total : 0,
	};
};
