import type { TSurveyResponse, TUnsanitizedCourse } from "@/types/shared";
import {
	aggregateResponses,
	groupCoursesWithSurveyResponses,
	sanitizeCourses,
} from "@/utils/array";
import { describe, expect, it } from "vitest";

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
		"1": 6,
		"2": 5,
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
		"1": 4,
		"2": 4,
	},
];

describe("aggregateResponses", () => {
	it("should group question responses into arrays", () => {
		const result = aggregateResponses(mockSurveyResponses);

		expect(result).toBeTypeOf("object");
		expect(Array.isArray(result["1"])).toBe(true);
		expect(Array.isArray(result["2"])).toBe(true);

		expect(result["1"]).toEqual([6, 4]);
		expect(result["2"]).toEqual([5, 4]);
	});
});

describe("sanitizeCourses", () => {
	it("should clean and convert valid numeric survey responses", () => {
		const unsanitizedCourses: TUnsanitizedCourse[] = [
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
					"1": [6, "", -1],
					"2": ["4", 5],
					"3": ["yes", "no"],
				},
			},
		];

		const result = sanitizeCourses(unsanitizedCourses);

		expect(result.length).toBe(1);
		const cleaned = result[0];

		expect(cleaned.responses["1"]).toEqual([6, 0, 0]);
		expect(cleaned.responses["2"]).toEqual([4, 5]);
		expect(cleaned.responses["3"]).toBeUndefined();
	});
});

describe("groupCoursesWithSurveyResponses", () => {
	it("groups survey responses into one course and aggregates answers", () => {
		const courses = groupCoursesWithSurveyResponses(mockSurveyResponses);

		expect(courses).toHaveLength(1);
		const course = courses[0];

		expect(course.courseName).toBe("Intro to Engineering");

		expect(course.responses["1"]).toEqual([6, 4]);
		expect(course.responses["2"]).toEqual([5, 4]);
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
