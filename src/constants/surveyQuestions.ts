import type { TSurveyResponseCourse } from "@/types/shared";
import { encodeQuestion } from "@/utils/encoding";

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

export const PULSE_QUESTIONS = [
	"Students like me are REPRESENTED in my engineering major/minor.",
	"This course helped me believe I can SUCCEED in an engineering field.",
	"Because of this course, I feel more likely to COMPLETE an engineering major/minor.",
	"Because of this course, I feel more like I BELONG in an engineering major/minor.",
	"Because of this course, I feel more SATISFIED with my engineering major/minor.",
];

export const QUESTIONS_TO_IGNORE = [
	"Please comment on how the course could better support your learning.",
	"Please comment on how the course positively supported your learning.",
];

export const REP_QUESTION_TEXT =
	"Students like me are REPRESENTED in my engineering major/minor.";

export const REP_QUESTION_KEY = encodeQuestion(REP_QUESTION_TEXT);
