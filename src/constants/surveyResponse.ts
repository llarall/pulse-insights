import type { TSurveyResponseCourse } from "@/types/shared";
import { encodeQuestion } from "@/utils/encoding";

export const REP_QUESTION_TEXT =
	"Students like me are REPRESENTED in my engineering major/minor.";

export const PULSE_QUESTIONS = [
	REP_QUESTION_TEXT,
	"This course helped me believe I can SUCCEED in an engineering field.",
	"Because of this course, I feel more likely to COMPLETE an engineering major/minor.",
	"Because of this course, I feel more like I BELONG in an engineering major/minor.",
	"Because of this course, I feel more SATISFIED with my engineering major/minor.",
];

export const REP_QUESTION_KEY = encodeQuestion(REP_QUESTION_TEXT);

export const REQUIRED_HEADERS_MAP: Record<string, keyof TSurveyResponseCourse> =
	{
		"RESPONSE #": "response",
		Term: "term",
		"Instructor ID": "instructorId",
		"First Name": "firstName",
		"Last Name": "lastName",
		Subject: "subject",
		Number: "number",
		Section: "section",
		"Course ID": "courseId",
		"Course Name": "courseName",
	};

export const REQUIRED_COURSE_FIELDS_SET = new Set<keyof TSurveyResponseCourse>(
	Object.values(REQUIRED_HEADERS_MAP)
);
