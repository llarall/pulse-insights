import {
	surveyResponseCourseValidator,
	surveyResponseQuestionsValidator,
	surveyResponseValidator,
} from "@/validators/surveyResponseValidator";
import { z } from "zod";

export type TCell = string;
export type TRow = TCell[];
export type TSurveyResponseQuestions = z.infer<
	typeof surveyResponseQuestionsValidator
>;
export type TSurveyQuestionKeys = keyof TSurveyResponseQuestions;
export type TCourse = TSurveyResponseCourse & {
	responses: Record<TSurveyQuestionKeys, number[]>;
};
export type TSurveyResponseCourse = z.infer<
	typeof surveyResponseCourseValidator
>;
export type TSurveyResponse = z.infer<typeof surveyResponseValidator>;
export type TGroupedSurveyStats = {
	questionKey: TSurveyQuestionKeys;
	overallMedian: number;
	lowRepMedian: number;
	highRepMedian: number;
	n: number;
	lowRepN: number;
	highRepN: number;
};
export type TRankedSurveyStats = TGroupedSurveyStats & {
	rank: number;
	lowRepRank: number;
	highRepRank: number;
};
export type TSurveySummary = {
	lowRepLessFavorablePct: number;
	highRepLessFavorablePct: number;
	sameResponsePct: number;
	topMedianDifferences: {
		questionKey: TSurveyQuestionKeys;
		difference: number;
		lowRepMedian: number;
		highRepMedian: number;
	}[];
	topRankDifferences: {
		questionKey: TSurveyQuestionKeys;
		rankDifference: number;
		lowRepRank: number;
		highRepRank: number;
	}[];
	averageLowRepMedian: number;
	averageHighRepMedian: number;
};
