import type {
	TCourse,
	TSurveyQuestionKeys,
	TSurveyResponse,
	TSurveyResponseQuestions,
} from "@/types/shared";
import { surveyResponseQuestionsValidator } from "@/validators/surveyResponseValidator";

export const surveyQuestionKeys = Object.keys(
	surveyResponseQuestionsValidator.shape
) as (keyof TSurveyResponseQuestions)[];

/**
 * Parses a set of survey responses for a single course,
 * grouping question answers into arrays by question.
 */
export const aggregateResponses = (
	surveyResponses: TSurveyResponse[]
): Record<TSurveyQuestionKeys, number[]> => {
	const result = {} as Record<TSurveyQuestionKeys, number[]>;

	for (const key of surveyQuestionKeys) {
		result[key] = surveyResponses
			.map((row) => row[key])
			.filter((val): val is number => typeof val === "number");
	}

	return result;
};

/**
 * Groups survey responses by term, instructorId, courseName, and number.
 * Aggregates all question responses into arrays.
 */
export const groupCoursesWithSurveyResponses = (
	surveyResponses: TSurveyResponse[]
): TCourse[] => {
	const surveyResponesMap = new Map<string, TSurveyResponse[]>();

	surveyResponses.forEach((surveyResponse) => {
		const key = `${surveyResponse.term}::${surveyResponse.instructorId}::${surveyResponse.courseName}::${surveyResponse.number}`;
		if (!surveyResponesMap.has(key)) {
			surveyResponesMap.set(key, []);
		}
		surveyResponesMap.get(key)!.push(surveyResponse);
	});

	const courses: TCourse[] = [];

	for (const surveyResponse of surveyResponesMap.values()) {
		const [header] = surveyResponse;
		courses.push({
			response: header.response,
			term: header.term,
			instructorId: header.instructorId,
			firstName: header.firstName,
			lastName: header.lastName,
			subject: header.subject,
			number: header.number,
			section: header.section,
			courseId: header.courseId,
			courseName: header.courseName,
			responses: aggregateResponses(surveyResponse),
		});
	}

	return courses;
};
