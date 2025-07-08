import { surveyResponseCourseValidator } from "@/validators/surveyResponseValidator";
import { z } from "zod";

export type TCell = string;
export type TRow = TCell[];

export type TUnsanitizedSurveyResponse = Record<string, unknown>;

export type TUnsanitizedCourse = TSurveyResponseCourse & {
	responses: TUnsanitizedSurveyResponse;
};

export type TCourse = TSurveyResponseCourse & {
	responses: Record<string, number[]>;
};

export type TSurveyResponseCourse = z.infer<
	typeof surveyResponseCourseValidator
>;

export type TSurveyResponse = TSurveyResponseCourse & {
	[encodedQuestionId: string]: string | number | undefined;
};

export type TGroupedSurveyStats = {
	questionKey: string;
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
		questionKey: string;
		difference: number;
		lowRepMedian: number;
		highRepMedian: number;
	}[];
	topRankDifferences: {
		questionKey: string;
		rankDifference: number;
		lowRepRank: number;
		highRepRank: number;
	}[];
	averageLowRepMedian: number;
	averageHighRepMedian: number;
};
