// Global mapping that links a question key to the question plaintext
const questionTextToKey: Record<string, string> = {};

let questionCounter = 1;

/**
 * Returns the key for a question, assigning a new one if needed.
 */
export const getOrCreateQuestionKey = (question: string): string => {
	if (!(question in questionTextToKey)) {
		const key = String(questionCounter++);
		questionTextToKey[question] = key;
	}
	return questionTextToKey[question];
};

/**
 * Reverse lookup: find question text by its assigned key.
 */
export const getQuestionTextByKey = (key: string): string => {
	for (const [question, mappedKey] of Object.entries(questionTextToKey)) {
		if (mappedKey === key) return question;
	}

	return "";
};

export const resetQuestionMap = () => {
	questionCounter = 1;
	for (const k in questionTextToKey) delete questionTextToKey[k];
};
