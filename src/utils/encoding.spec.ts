import { describe, expect, it } from "vitest";
import { decodeQuestion, encodeQuestion } from "./encoding";

describe("encoding", () => {
	it("should encode and decode basic ASCII strings", () => {
		const question = "How satisfied were you with the course?";
		const encoded = encodeQuestion(question);
		const decoded = decodeQuestion(encoded);
		expect(decoded).toBe(question);
	});

	it("should handle special characters and punctuation", () => {
		const question = "What did you think of the instructor's teaching style?";
		const encoded = encodeQuestion(question);
		const decoded = decodeQuestion(encoded);
		expect(decoded).toBe(question);
	});

	it("should support emoji and unicode characters", () => {
		const question = "How was your experience? 🧡";
		const encoded = encodeQuestion(question);
		const decoded = decodeQuestion(encoded);
		expect(decoded).toBe(question);
	});

	it("should return consistent encoded value for same input", () => {
		const question = "Same input";
		const encoded1 = encodeQuestion(question);
		const encoded2 = encodeQuestion(question);
		expect(encoded1).toBe(encoded2);
	});
});
