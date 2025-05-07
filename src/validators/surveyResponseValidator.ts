import { z } from "zod";

export const surveyResponseCourseValidator = z.object({
	response: z.string(),
	term: z.string(),
	instructorId: z.string(),
	firstName: z.string(),
	lastName: z.string(),
	subject: z.string(),
	number: z.string(),
	section: z.string(),
	courseId: z.string(),
	courseName: z.string(),
});

export const surveyResponseValidator =
	surveyResponseCourseValidator.passthrough();
