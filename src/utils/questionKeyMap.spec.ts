import { beforeEach, describe, expect, it } from "vitest";
import {
	getOrCreateQuestionKey,
	getQuestionTextByKey,
	resetQuestionMap,
} from "./questionKeyMap";

describe("questionKey utility", () => {
	beforeEach(() => {
		resetQuestionMap();
	});

	it("assigns incremental keys to unique questions", () => {
		const key1 = getOrCreateQuestionKey("Question A");
		const key2 = getOrCreateQuestionKey("Question B");

		expect(key1).toBe("1");
		expect(key2).toBe("2");
		expect(key1).not.toBe(key2);
	});

	it("returns the same key when asked multiple times for the same question", () => {
		const firstCall = getOrCreateQuestionKey("Same Question");
		const secondCall = getOrCreateQuestionKey("Same Question");

		expect(firstCall).toBe("1");
		expect(secondCall).toBe("1");
	});

	it("can reverse lookup the original question from a key", () => {
		getOrCreateQuestionKey("Reverse Me");

		const question = getQuestionTextByKey("1");
		expect(question).toBe("Reverse Me");
	});

	it("returns empty string when key does not exist", () => {
		const missing = getQuestionTextByKey("999");
		expect(missing).toBe("");
	});

	it("resets internal state properly", () => {
		getOrCreateQuestionKey("Q1");
		getOrCreateQuestionKey("Q2");

		resetQuestionMap();

		const key = getOrCreateQuestionKey("Q1");
		expect(key).toBe("1");

		const reverse = getQuestionTextByKey("1");
		expect(reverse).toBe("Q1");

		const key2 = getOrCreateQuestionKey("Q2");
		expect(key2).toBe("2");
	});
});
