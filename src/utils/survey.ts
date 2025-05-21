import type {
	TCourse,
	TGroupedSurveyStats,
	TRankedSurveyStats,
	TSurveySummary,
} from "@/types/shared";
import {
	PULSE_QUESTIONS,
	REP_QUESTION_KEY,
	QUESTIONS_TO_IGNORE,
} from "../constants/surveyQuestions";
import { decodeQuestion } from "./encoding";
import { calculateTukeyInterpolatedMedian } from "./math";

/**
 * Calculates median stats for each question,
 * grouping students by responses to `baseKey` (default = question7),
 * using a column-oriented input (Record<questionKey, number[]>).
 */
export const calculateGroupedSurveyStatsFromColumns = (
	responses: TCourse["responses"],
	baseKey: string = REP_QUESTION_KEY
): TGroupedSurveyStats[] => {
	const isValid = (n: number): boolean =>
		typeof n === "number" && !isNaN(n) && n > 0 && n <= 6;

	const baseResponses = responses[baseKey] ?? [];
	const repFiltered = baseResponses.map((n) => (isValid(n) ? n : null));
	const repValid = repFiltered.filter((n): n is number => n !== null);
	const repMedian = calculateTukeyInterpolatedMedian(repValid);

	const lowRepIndices = new Set<number>();
	const highRepIndices = new Set<number>();

	repFiltered.forEach((val, i) => {
		if (val === null) return;
		(val <= repMedian! ? lowRepIndices : highRepIndices).add(i);
	});

	return Object.entries(responses).map(([questionKey, values]) => {
		const all = values.filter(isValid);
		const lowRep = Array.from(lowRepIndices)
			.map((i) => values[i])
			.filter(isValid);
		const highRep = Array.from(highRepIndices)
			.map((i) => values[i])
			.filter(isValid);

		return {
			questionKey,
			questionText: decodeQuestion(questionKey),
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
): Map<string, number> => {
	const sorted = [...values]
		.filter((s) => getValue(s) !== null)
		.sort((a, b) => {
			const diff = getValue(b)! - getValue(a)!;
			if (diff !== 0) return diff;
			return a.questionKey.localeCompare(b.questionKey);
		});

	const ranks = new Map<string, number>();

	sorted.forEach((item, index) => {
		ranks.set(item.questionKey, index + 1);
	});

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
 * Returns boolean if the questionText provided is a known pulse question
 */
export const isPulseQuestion = (
	questionText: TGroupedSurveyStats["questionText"]
) => PULSE_QUESTIONS.includes(questionText);

/**
 * Returns boolean if the question should not be displayed on the results table
 */
export const isIgnorableQuestion = (
	questionText: TGroupedSurveyStats["questionText"]
) => QUESTIONS_TO_IGNORE.includes(questionText);

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
