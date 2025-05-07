import { encodeQuestion } from "@/utils/encoding";

export const PULSE_QUESTIONS = [
	"Students like me are REPRESENTED in my engineering major/minor.",
	"This course helped me believe I can SUCCEED in an engineering field.",
	"Because of this course, I feel more likely to COMPLETE an engineering major/minor.",
	"Because of this course, I feel more like I BELONG in an engineering major/minor.",
	"Because of this course, I feel more SATISFIED with my engineering major/minor.",
];

export const REP_QUESTION_TEXT =
	"Students like me are REPRESENTED in my engineering major/minor.";

export const REP_QUESTION_KEY = encodeQuestion(REP_QUESTION_TEXT);
