import type { TSurveyResponse, TUnsanitizedCourse } from "@/types/shared";
import {
	aggregateResponses,
	groupCoursesWithSurveyResponses,
	sanitizeCourses,
} from "@/utils/array";
import { describe, expect, it } from "vitest";
import { encodeQuestion } from "./encoding";

const mockSurveyResponses = [
	{
		response: "RESPONSE #1",
		term: "Fall 2025",
		instructorId: "123",
		firstName: "Alice",
		lastName: "Smith",
		subject: "ENGR",
		number: "101",
		section: "001",
		courseId: "ENGR101",
		courseName: "Intro to Engineering",
		[encodeQuestion("My instructor modeled and promoted inclusivity.")]: 6,
		[encodeQuestion(
			"If you read this question then select mostly disagree."
		)]: 5,
	},
	{
		response: "RESPONSE #2",
		term: "Fall 2025",
		instructorId: "123",
		firstName: "Alice",
		lastName: "Smith",
		subject: "ENGR",
		number: "101",
		section: "001",
		courseId: "ENGR101",
		courseName: "Intro to Engineering",
		[encodeQuestion("My instructor modeled and promoted inclusivity.")]: 4,
		[encodeQuestion(
			"If you read this question then select mostly disagree."
		)]: 4,
	},
];

describe("aggregateResponses", () => {
	it("should group question responses into arrays", () => {
		const result = aggregateResponses(mockSurveyResponses);

		const key1 = encodeQuestion(
			"My instructor modeled and promoted inclusivity."
		);
		const key12 = encodeQuestion(
			"If you read this question then select mostly disagree."
		);

		expect(result).toBeTypeOf("object");
		expect(Array.isArray(result[key1])).toBe(true);
		expect(Array.isArray(result[key12])).toBe(true);

		expect(result[key1]).toEqual([6, 4]);
		expect(result[key12]).toEqual([5, 4]);
	});
});

describe("sanitizeCourses", () => {
	it("should clean and convert valid numeric survey responses", () => {
		const q1 = encodeQuestion("Question 1");
		const q2 = encodeQuestion("Question 2");
		const q3 = encodeQuestion("Question 3"); // will be removed (contains "yes")

		const dirtyCourses: TUnsanitizedCourse[] = [
			{
				response: "RESPONSE #1",
				term: "Spring 2025",
				instructorId: "123",
				firstName: "Alice",
				lastName: "Smith",
				subject: "ENGR",
				number: "101",
				section: "001",
				courseId: "ENGR101",
				courseName: "Intro to Engineering",
				responses: {
					[q1]: [6, "", -1],
					[q2]: ["4", 5],
					[q3]: ["yes", "no"], // should be removed
				},
			},
		];

		const result = sanitizeCourses(dirtyCourses);

		expect(result.length).toBe(1);
		const cleaned = result[0];

		expect(cleaned.responses[q1]).toEqual([6, 0, 0]);
		expect(cleaned.responses[q2]).toEqual([4, 5]);
		expect(cleaned.responses[q3]).toBeUndefined();
	});
});

describe("groupCoursesWithSurveyResponses", () => {
	it("groups survey responses into one course and aggregates answers", () => {
		const courses = groupCoursesWithSurveyResponses(mockSurveyResponses);

		expect(courses).toHaveLength(1);
		const course = courses[0];

		expect(course.courseName).toBe("Intro to Engineering");

		const q1 = encodeQuestion(
			"My instructor modeled and promoted inclusivity."
		);
		const q2 = encodeQuestion(
			"If you read this question then select mostly disagree."
		);

		expect(course.responses[q1]).toEqual([6, 4]);
		expect(course.responses[q2]).toEqual([5, 4]);
	});

	it("creates separate courses when grouping fields differ", () => {
		const differentCourse: TSurveyResponse = {
			...mockSurveyResponses[0],
			number: "102", // only change
			courseId: "ENGR102",
			courseName: "Engineering Design",
		};

		const grouped = groupCoursesWithSurveyResponses([
			...mockSurveyResponses,
			differentCourse,
		]);

		expect(grouped).toHaveLength(2);
		const names = grouped.map((c) => c.courseName);
		expect(names).toContain("Intro to Engineering");
		expect(names).toContain("Engineering Design");
	});
});
