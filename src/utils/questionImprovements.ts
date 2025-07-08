import { questionImprovementMap } from "@/constants/questionImprovementMap";
import { TGroupedSurveyStats } from "@/types/shared";
import { getQuestionTextByKey } from "./questionKeyMap";

/**
 * Returns instructional suggestions and a resource link to help improve
 * responses for a specific survey question.
 */
export const getImprovementSuggestions = (
	questionKey: TGroupedSurveyStats["questionKey"]
) => questionImprovementMap[getQuestionTextByKey(questionKey)] ?? null;
