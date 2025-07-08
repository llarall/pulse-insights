import { TRankedSurveyStats } from "@/types/shared";
import { atomWithReset } from "jotai/utils";

type TStatsModalAtom = {
	isOpen: boolean;
	stats?: TRankedSurveyStats;
};

export const statsModalAtom = atomWithReset<TStatsModalAtom>({
	isOpen: false,
});
