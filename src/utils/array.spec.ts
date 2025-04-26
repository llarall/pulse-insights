import type { TSurveyResponse } from "@/types/shared";
import {
	aggregateResponses,
	groupCoursesWithSurveyResponses,
	surveyQuestionKeys,
} from "@/utils/array";
import { describe, expect, it } from "vitest";

const mockSurveyResponses: TSurveyResponse[] = [
	{
		response: "RESPONSE #1",
		term: "Winter Term 2025 (202502)",
		instructorId: "900000000",
		firstName: "Larissa",
		lastName: "Letaw",
		subject: "CS",
		number: "361",
		section: "400",
		courseId: "32003",
		courseName: "SOFTWARE ENGINEERING I",
		question1: 6,
		question2: 5,
		question3: 4,
		question4: 6,
		question5: 5,
		question6: 6,
		question7: 4,
		question8: 5,
		question9: 6,
		question10: 6,
		question11: 6,
		question12: 5,
		question13: 6,
		question14: 6,
		question15: 5,
		question16: 6,
		question17: 5,
		question18: 6,
		question19: 5,
		question20: 6,
		question21: 5,
		question22: 6,
	},
	{
		response: "RESPONSE #2",
		term: "Winter Term 2025 (202502)",
		instructorId: "900000000",
		firstName: "Larissa",
		lastName: "Letaw",
		subject: "CS",
		number: "361",
		section: "400",
		courseId: "32003",
		courseName: "SOFTWARE ENGINEERING I",
		question1: 4,
		question2: 4,
		question3: 4,
		question4: 4,
		question5: 4,
		question6: 4,
		question7: 4,
		question8: 4,
		question9: 4,
		question10: 4,
		question11: 4,
		question12: 4,
		question13: 4,
		question14: 4,
		question15: 4,
		question16: 4,
		question17: 4,
		question18: 4,
		question19: 4,
		question20: 4,
		question21: 4,
		question22: 4,
	},
];

describe("aggregateResponses", () => {
	it("should group question responses into arrays", () => {
		const result = aggregateResponses(mockSurveyResponses);
		expect(result).toBeTypeOf("object");

		for (const key of surveyQuestionKeys) {
			expect(Array.isArray(result[key])).toBe(true);
			expect(result[key]?.length).toBe(2);
		}

		expect(result.question1).toEqual([6, 4]);
		expect(result.question12).toEqual([5, 4]);
	});
});

describe("groupCoursesWithSurveyResponses", () => {
	it("should group responses by course fields and aggregate answers", () => {
		const courses = groupCoursesWithSurveyResponses(mockSurveyResponses);
		expect(courses.length).toBe(1); // same instructor/course

		const course = courses[0];
		expect(course.courseName).toBe("SOFTWARE ENGINEERING I");
		expect(course.responses.question1).toEqual([6, 4]);
		expect(course.responses.question22).toEqual([6, 4]);
	});

	it("should group multiple distinct courses separately", () => {
		const newCourseResponse: TSurveyResponse = {
			...mockSurveyResponses[0],
			number: "362", // different number
			courseId: "32004",
			courseName: "SOFTWARE ENGINEERING II",
		};

		const multiCourses = groupCoursesWithSurveyResponses([
			...mockSurveyResponses,
			newCourseResponse,
		]);

		expect(multiCourses.length).toBe(2);
		const names = multiCourses.map((c) => c.courseName);
		expect(names).toContain("SOFTWARE ENGINEERING I");
		expect(names).toContain("SOFTWARE ENGINEERING II");
	});
});
