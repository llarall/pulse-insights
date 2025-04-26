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

export const surveyResponseQuestionsValidator = z.object({
	question1: z.coerce.number(),
	question2: z.coerce.number(),
	question3: z.coerce.number(),
	question4: z.coerce.number(),
	question5: z.coerce.number(),
	question6: z.coerce.number(),
	question7: z.coerce.number(),
	question8: z.coerce.number(),
	question9: z.coerce.number(),
	question10: z.coerce.number(),
	question11: z.coerce.number(),
	question12: z.coerce.number(),
	question13: z.coerce.number(),
	question14: z.coerce.number(),
	question15: z.coerce.number(),
	question16: z.coerce.number(),
	question17: z.coerce.number(),
	question18: z.coerce.number(),
	question19: z.coerce.number(),
	question20: z.coerce.number(),
	question21: z.coerce.number(),
	question22: z.coerce.number(),
});

export const surveyResponseValidator = surveyResponseCourseValidator
	.merge(surveyResponseQuestionsValidator)
	.strip();
