import type { TCourse } from "@/types/shared";
import {
	calculateGroupedSurveyStatsFromColumns,
	rankGroupedStats,
} from "@/utils/survey";
import { useMemo } from "react";

/**
 * Hook that calculates and ranks survey stats from course responses.
 */
export const useSurveyStats = (responses?: TCourse["responses"]) => {
	const stats = useMemo(() => {
		if (!responses) return [];
		return calculateGroupedSurveyStatsFromColumns(responses);
	}, [responses]);

	const rankedStats = useMemo(() => {
		return rankGroupedStats(stats);
	}, [stats]);

	return { rankedStats };
};
