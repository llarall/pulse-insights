import type { TRow } from "@/types/shared";
import { describe, expect, it } from "vitest";

import { normalizeHeader, parseSheetRowsToResponses } from "@/utils/file";

const HEADER_ROW = [
	"RESPONSE #",
	"Term",
	"Instructor ID",
	"First Name",
	"Last Name",
	"Subject",
	"Number",
	"Section",
	"Course ID",
	"Course Name",
	"My instructor modeled and promoted inclusivity.",
	"The course materials were accessible to me.",
	"I felt like I belonged in this course.",
	"This course was structured so that I could work effectively with others who were different from me.",
	"I had the necessary resources to achieve the course learning outcomes.",
	"Course learning activities helped me connect to the content.",
	"Students like me are REPRESENTED in my engineering major/minor.",
	"This course helped me believe I can SUCCEED in an engineering field.",
	"Because of this course, I feel more likely to COMPLETE an engineering major/minor.",
	"Because of this course, I feel more like I BELONG in an engineering major/minor.",
	"Because of this course, I feel more SATISFIED with my engineering major/minor.",
	"If you read this question then select mostly disagree.",
	"This course was well organized.",
	"Course activities gave me the chance to show my progress towards course learning outcomes.",
	"Feedback on test, assignments, and/or graded activities informed my thinking and learning.",
	"Directions and expectations for tests, assignments and/or graded activities were clear.",
	"Tests, assignments and/or graded activities matched the course learning outcomes.",
	"My instructor addressed students' non-academic needs.",
	"I had opportunities to develop professional skills.",
	"I had opportunities to become a better learner.",
	"The course as a whole was",
	"The instructor's contribution to the course was",
	"Please comment on how the course positively supported your learning.",
	"Please comment on how the course could better support your learning.",
	'You have the option of signing your comments on this evaluation. If you click the "yes" button, your comments will be sent to BOTH the instructor and the instructor\'s supervisor and your name will be identified with the comments (i.e. you will no longer be anonymous). If you click the "no" button, your comments will be available ONLY to the instructor (not the supervisor) and you will NOT be identified with your comments.',
];

describe("normalizeHeader", () => {
	it("should normalize a simple header", () => {
		expect(normalizeHeader("First Name")).toBe("firstName");
		expect(normalizeHeader("Course ID")).toBe("courseId");
		expect(normalizeHeader("RESPONSE #")).toBe("response");
	});

	it("should remove special characters and properly camelCase", () => {
		expect(normalizeHeader("Students' non-academic needs")).toBe(
			"studentsNonAcademicNeeds"
		);
		expect(
			normalizeHeader("Feedback on test, assignments and/or graded activities")
		).toBe("feedbackOnTestAssignmentsAndOrGradedActivities");
	});
});

describe("parseSheetRowsToResponses", () => {
	it("should parse valid survey rows and clean them", () => {
		const rows: TRow[] = [
			HEADER_ROW,
			[
				"RESPONSE #1",
				"Winter Term 2025 (202502)",
				"900000000",
				"John",
				"Johnson",
				"CS",
				"361",
				"400",
				"32003",
				"SOFTWARE ENGINEERING I",
				"6.0",
				"6.0",
				"6.0",
				"6.0",
				"6.0",
				"6.0",
				"6.0",
				"6.0",
				"6.0",
				"6.0",
				"6.0",
				"",
				"6.0",
				"6.0",
				"6.0",
				"6.0",
				"6.0",
				"6.0",
				"6.0",
				"6.0",
				"6.0",
				"6.0",
				"",
				"",
				"Yes",
			],
			[
				"RESPONSE #2",
				"Winter Term 2025 (202502)",
				"900000000",
				"Jane",
				"Janes",
				"CS",
				"361",
				"400",
				"32003",
				"SOFTWARE ENGINEERING I",
				"5.0",
				"5.0",
				"5.0",
				"5.0",
				"5.0",
				"5.0",
				"5.0",
				"4.0",
				"4.0",
				"4.0",
				"4.0",
				"2.0",
				"5.0",
				"5.0",
				"5.0",
				"5.0",
				"5.0",
				"5.0",
				"5.0",
				"5.0",
				"4.0",
				"5.0",
				"",
				"",
				"No",
			],
		];

		const responses = parseSheetRowsToResponses(rows);

		expect(responses.length).toBe(2);
		expect(responses[0].firstName).toBe("John");
		expect(responses[1].firstName).toBe("Jane");
	});

	it("should return an empty array if there are no rows", () => {
		const responses = parseSheetRowsToResponses([]);
		expect(responses).toEqual([]);
	});

	it("should skip empty rows", () => {
		const rows: TRow[] = [HEADER_ROW, []];

		const responses = parseSheetRowsToResponses(rows);
		expect(responses.length).toBe(0);
	});
});

// You could also later write integration tests for `parseSurveyResponsesFromFile`
// but it requires mocking File and arrayBuffer, so might be better for a follow-up if you need!
