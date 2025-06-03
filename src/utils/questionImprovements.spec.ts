import { questionImprovementMap } from "@/constants/questionImprovementMap";
import { beforeEach, describe, expect, it } from "vitest";
import { getImprovementSuggestions } from "./questionImprovements";
import { getOrCreateQuestionKey, resetQuestionMap } from "./questionKeyMap";

describe("getImprovementSuggestions", () => {
	beforeEach(() => {
		resetQuestionMap();
	});

	it("returns suggestions and link for a known question", () => {
		const question = "My instructor modeled and promoted inclusivity.";
		const questionKey = getOrCreateQuestionKey(question);

		const result = getImprovementSuggestions(questionKey);

		expect(result).toBeTruthy();
		expect(result?.link).toBe(
			"https://udlguidelines.cast.org/representation/perception/perspectives-identities/"
		);
		expect(Array.isArray(result?.suggestions)).toBe(true);
		expect(result?.suggestions.length).toBeGreaterThan(0);
	});

	it("returns null for an unknown question", () => {
		const unknownQuestion = "This question is not in the map.";
		const questionKey = getOrCreateQuestionKey(unknownQuestion);

		const result = getImprovementSuggestions(questionKey);

		expect(result).toBeNull();
	});

	it("uses the original question text from the map", () => {
		for (const [questionText, expected] of Object.entries(
			questionImprovementMap
		)) {
			resetQuestionMap();
			const questionKey = getOrCreateQuestionKey(questionText);
			const result = getImprovementSuggestions(questionKey);
			expect(result).toEqual(expected);
		}
	});
});
