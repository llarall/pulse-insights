import { REQUIRED_HEADERS_MAP } from "@/constants/surveyResponse";
import type {
	TCourse,
	TSurveyResponse,
	TSurveyResponseCourse,
	TUnsanitizedCourse,
} from "@/types/shared";

/**
 * Parses a set of survey responses for a single course,
 * grouping question answers into arrays by question.
 */
export const aggregateResponses = (
	surveyResponses: TSurveyResponse[]
): Record<string, unknown[]> => {
	const result: Record<string, unknown[]> = {};

	for (const response of surveyResponses) {
		for (const [key, val] of Object.entries(response)) {
			// Skip known metadata fields
			if (
				Object.values(REQUIRED_HEADERS_MAP).includes(
					key as keyof TSurveyResponseCourse
				)
			)
				continue;

			if (!result[key]) result[key] = [];
			result[key].push(val);
		}
	}

	return result;
};

/**
 * Groups survey responses by term, instructorId, courseName, and number.
 * Aggregates all question responses into arrays.
 */
export const groupCoursesWithSurveyResponses = (
	surveyResponses: TSurveyResponse[]
): TUnsanitizedCourse[] => {
	const surveyResponesMap = new Map<string, TSurveyResponse[]>();

	surveyResponses.forEach((surveyResponse) => {
		const key = `${surveyResponse.term}::${surveyResponse.instructorId}::${surveyResponse.courseName}::${surveyResponse.number}`;
		if (!surveyResponesMap.has(key)) {
			surveyResponesMap.set(key, []);
		}
		surveyResponesMap.get(key)!.push(surveyResponse);
	});

	const courses: TUnsanitizedCourse[] = [];

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

/**
 * Cleans up raw course responses:
 * - Converts strings and "-1" to numbers
 * - Turns blank or invalid values into 0
 * - Skips questions with answers like "yes", "no", "good", or "bad"
 */
export const sanitizeCourses = (
	dirtyCourses: TUnsanitizedCourse[]
): TCourse[] => {
	return dirtyCourses.map((course) => {
		const cleanedResponses: TCourse["responses"] = {};

		for (const [questionKey, values] of Object.entries(course.responses)) {
			const responsesArray = Array.isArray(values) ? values : [];

			const hasDisqualifyingValue = responsesArray.some(
				(val) =>
					typeof val === "string" && /^(good|bad|yes|no)$/i.test(val.trim())
			);

			if (hasDisqualifyingValue) continue;

			cleanedResponses[questionKey] = responsesArray.map((val) => {
				if (
					val === null ||
					val === undefined ||
					val === "" ||
					val === -1 ||
					val === "-1"
				) {
					return 0;
				}

				if (typeof val === "number") return val;
				if (typeof val === "string" && !isNaN(Number(val))) return Number(val);

				return 0;
			});
		}

		return {
			...course,
			responses: cleanedResponses,
		};
	});
};
