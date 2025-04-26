import type { TSurveyQuestionKeys } from "@/types/shared";

export const SURVEY_QUESTIONS_MAP: Record<TSurveyQuestionKeys, string> = {
	question1: "My instructor modeled and promoted inclusivity.",
	question2: "The course materials were accessible to me.",
	question3: "I felt like I belonged in this course.",
	question4:
		"This course was structured so that I could work effectively with others who were different from me.",
	question5:
		"I had the necessary resources to achieve the course learning outcomes.",
	question6: "Course learning activities helped me connect to the content.",
	question7: "Students like me are REPRESENTED in my engineering major/minor.",
	question8:
		"This course helped me believe I can SUCCEED in an engineering field.",
	question9:
		"Because of this course, I feel more likely to COMPLETE an engineering major/minor.",
	question10:
		"Because of this course, I feel more like I BELONG in an engineering major/minor.",
	question11:
		"Because of this course, I feel more SATISFIED with my engineering major/minor.",
	question12: "If you read this question then select mostly disagree.",
	question13: "This course was well organized.",
	question14:
		"Course activities gave me the chance to show my progress towards course learning outcomes.",
	question15:
		"Feedback on test, assignments, and/or graded activities informed my thinking and learning.",
	question16:
		"Directions and expectations for tests, assignments and/or graded activities were clear.",
	question17:
		"Tests, assignments and/or graded activities matched the course learning outcomes.",
	question18: "My instructor addressed students' non-academic needs.",
	question19: "I had opportunities to develop professional skills.",
	question20: "I had opportunities to become a better learner.",
	question21: "The course as a whole was",
	question22: "The instructor's contribution to the course was",
} as const;

export const PULSE_QUESTIONS: TSurveyQuestionKeys[] = [
	"question7",
	"question8",
	"question9",
	"question10",
	"question11",
];
