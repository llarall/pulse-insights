import type {
	TCourse,
	TGroupedSurveyStats,
	TRankedSurveyStats,
} from "@/types/shared";
import { describe, expect, it } from "vitest";
import {
	calculateSummaryStats,
	getResponsesForQuestion,
	isPulseQuestion,
	rankBy,
	rankGroupedStats,
} from "./survey";

const mockResponses: TCourse["responses"] = {
	question1: [6, 5],
	question2: [4, 5],
	question3: [5, 5],
	question4: [6, 5],
	question5: [5, 5],
	question6: [6, 6],
	question7: [4, 5, 3, 6], // Representation question
	question8: [5, 5],
	question9: [5, 5],
	question10: [6, 5],
	question11: [6, 5],
	question12: [5, 5],
	question13: [6, 5],
	question14: [5, 5],
	question15: [5, 5],
	question16: [5, 5],
	question17: [5, 5],
	question18: [5, 5],
	question19: [5, 5],
	question20: [5, 5],
	question21: [5, 5],
	question22: [5, 5],
};

describe("rankBy", () => {
	const mockData: TGroupedSurveyStats[] = [
		{
			questionKey: "question1",
			overallMedian: 5,
			lowRepMedian: 0,
			highRepMedian: 0,
			n: 10,
			lowRepN: 5,
			highRepN: 5,
		},
		{
			questionKey: "question2",
			overallMedian: 3,
			lowRepMedian: 0,
			highRepMedian: 0,
			n: 10,
			lowRepN: 5,
			highRepN: 5,
		},
		{
			questionKey: "question3",
			overallMedian: 5,
			lowRepMedian: 0,
			highRepMedian: 0,
			n: 10,
			lowRepN: 5,
			highRepN: 5,
		},
	];

	it("ranks by overallMedian correctly", () => {
		const ranks = rankBy(mockData, (s) => s.overallMedian);

		expect(ranks.get("question1")).toBe(1);
		expect(ranks.get("question3")).toBe(1); // same value, same rank
		expect(ranks.get("question2")).toBe(3);
	});
});

describe("rankGroupedStats", () => {
	const mockData: TGroupedSurveyStats[] = [
		{
			questionKey: "question1",
			overallMedian: 5,
			lowRepMedian: 3,
			highRepMedian: 6,
			n: 10,
			lowRepN: 5,
			highRepN: 5,
		},
		{
			questionKey: "question2",
			overallMedian: 3,
			lowRepMedian: 2,
			highRepMedian: 4,
			n: 10,
			lowRepN: 5,
			highRepN: 5,
		},
		{
			questionKey: "question3",
			overallMedian: 5,
			lowRepMedian: 3,
			highRepMedian: 6,
			n: 10,
			lowRepN: 5,
			highRepN: 5,
		},
	];

	it("applies correct ranks to grouped stats", () => {
		const ranked = rankGroupedStats(mockData);

		const q1 = ranked.find((r) => r.questionKey === "question1")!;
		const q2 = ranked.find((r) => r.questionKey === "question2")!;
		const q3 = ranked.find((r) => r.questionKey === "question3")!;

		expect(q1.rank).toBe(1);
		expect(q3.rank).toBe(1);
		expect(q2.rank).toBe(3);

		expect(q1.lowRepRank).toBe(1);
		expect(q3.lowRepRank).toBe(1);
		expect(q2.lowRepRank).toBe(3);

		expect(q1.highRepRank).toBe(1);
		expect(q3.highRepRank).toBe(1);
		expect(q2.highRepRank).toBe(3);
	});
});

describe("getResponsesForQuestion", () => {
	it("should return the correct responses array for a valid question text", () => {
		const responses = getResponsesForQuestion(mockResponses, "question7");

		expect(responses).toEqual([4, 5, 3, 6]);
	});

	it("should return an empty array if the question responses are missing", () => {
		const tempResponses: TCourse["responses"] = {
			...mockResponses,
			question7: [],
		};

		const responses = getResponsesForQuestion(tempResponses, "question7");

		expect(responses).toEqual([]);
	});

	it("should still work even if the responses field is missing a question key (returns empty)", () => {
		const tempResponses: TCourse["responses"] = {
			...mockResponses,
			question7: [],
		};

		const responses = getResponsesForQuestion(tempResponses, "question7");

		expect(responses).toEqual([]);
	});
});

describe("isPulseQuestion", () => {
	it("should return true when the question is a known pulse question", () => {
		const result = isPulseQuestion("question7");

		expect(result).toEqual(true);
	});

	it("should return false when the question is not a known pulse question", () => {
		const result = isPulseQuestion("question2");

		expect(result).toEqual(false);
	});
});

describe("calculateSummaryStats", () => {
	const mockStats: TRankedSurveyStats[] = [
		{
			questionKey: "question1",
			overallMedian: 5,
			lowRepMedian: 4,
			highRepMedian: 6,
			lowRepN: 50,
			highRepN: 60,
			rank: 1,
			lowRepRank: 2,
			highRepRank: 1,
			n: 0,
		},
		{
			questionKey: "question2",
			overallMedian: 5,
			lowRepMedian: 5,
			highRepMedian: 5,
			lowRepN: 50,
			highRepN: 60,
			rank: 2,
			lowRepRank: 3,
			highRepRank: 3,
			n: 0,
		},
		{
			questionKey: "question3",
			overallMedian: 5,
			lowRepMedian: 6,
			highRepMedian: 5,
			lowRepN: 50,
			highRepN: 60,
			rank: 3,
			lowRepRank: 1,
			highRepRank: 4,
			n: 0,
		},
	];

	it("calculates percentages correctly", () => {
		const summary = calculateSummaryStats(mockStats);

		expect(summary.lowRepLessFavorablePct).toBeCloseTo(33.33, 1);
		expect(summary.highRepLessFavorablePct).toBeCloseTo(33.33, 1);
		expect(summary.sameResponsePct).toBeCloseTo(33.33, 1);
	});

	it("finds top 2 median differences", () => {
		const summary = calculateSummaryStats(mockStats);

		expect(summary.topMedianDifferences.length).toBe(2);
		expect(summary.topMedianDifferences[0].questionKey).toBe("question1");
		expect(summary.topMedianDifferences[1].questionKey).toBe("question3");
	});

	it("finds top 2 rank differences", () => {
		const summary = calculateSummaryStats(mockStats);

		expect(summary.topRankDifferences.length).toBe(2);
		expect(summary.topRankDifferences[0].questionKey).toBe("question3");
		expect(summary.topRankDifferences[1].questionKey).toBe("question1");
	});

	it("calculates averages correctly", () => {
		const summary = calculateSummaryStats(mockStats);

		expect(summary.averageLowRepMedian).toBeCloseTo((4 + 5 + 6) / 3, 5);
		expect(summary.averageHighRepMedian).toBeCloseTo((6 + 5 + 5) / 3, 5);
	});

	it("handles empty input", () => {
		const summary = calculateSummaryStats([]);

		expect(summary.lowRepLessFavorablePct).toBe(0);
		expect(summary.highRepLessFavorablePct).toBe(0);
		expect(summary.sameResponsePct).toBe(0);
		expect(summary.topMedianDifferences.length).toBe(0);
		expect(summary.topRankDifferences.length).toBe(0);
		expect(summary.averageLowRepMedian).toBe(0);
		expect(summary.averageHighRepMedian).toBe(0);
	});
});
