import type { TCourse, TGroupedSurveyStats } from "@/types/shared";
import { describe, expect, it } from "vitest";
import {
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
