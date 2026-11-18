import { PULSE_QUESTIONS } from "@/constants/surveyQuestions";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MissingPulseQuestionsModal } from "./MissingPulseQuestionsModal";

describe("MissingPulseQuestionsModal", () => {
	it("stays closed when the file includes the PULSE questions", () => {
		const html = renderToStaticMarkup(
			<MissingPulseQuestionsModal missingQuestions={[]} onClose={() => {}} />
		);

		expect(html).toBe("");
	});

	it("warns that most of the tool will not work when every PULSE question is missing", () => {
		const html = renderToStaticMarkup(
			<MissingPulseQuestionsModal
				missingQuestions={[...PULSE_QUESTIONS]}
				onClose={() => {}}
			/>
		);

		expect(html).toContain("Missing PULSE questions");
		expect(html).toContain(
			"Most of this tool won&#x27;t work without the PULSE questions."
		);
		expect(html).toContain("This file doesn&#x27;t include those questions.");
		expect(html).toContain("How to add the questions");
	});

	it("lists the PULSE questions that are missing from the file", () => {
		const html = renderToStaticMarkup(
			<MissingPulseQuestionsModal
				missingQuestions={[PULSE_QUESTIONS[0]]}
				onClose={() => {}}
			/>
		);

		expect(html).toContain("This file is missing:");
		expect(html).toContain(PULSE_QUESTIONS[0]);
		expect(html).not.toContain(PULSE_QUESTIONS[1]);
	});
});
