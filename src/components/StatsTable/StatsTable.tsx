import { courseAtom } from "@/atoms/courseAtom";
import { statsModalAtom } from "@/atoms/statsModalAtom";
import { useSurveyStats } from "@/hooks/useSurveyStats";
import type { TRankedSurveyStats } from "@/types/shared";
import { getQuestionTextByKey } from "@/utils/questionKeyMap";
import { isPulseQuestion } from "@/utils/survey";
import { useAtomValue, useSetAtom } from "jotai";
import { useMemo, useState } from "react";
import { Card } from "../Card/Card";
import { StatsModal } from "../StatsModal/StatsModal";
import { MedianCell } from "./MedianCell";
import styles from "./StatsTable.module.css";

const TABLE_HEADERS: Record<
	keyof TRankedSurveyStats,
	{ label: string; sortable: boolean }
> = {
	questionKey: { label: "Question", sortable: true },
	overallMedian: { label: "Median", sortable: true },
	lowRepMedian: { label: "LowRep Median", sortable: true },
	highRepMedian: { label: "HighRep Median", sortable: true },
	n: { label: "n", sortable: true },
	lowRepN: { label: "LowRep n", sortable: true },
	highRepN: { label: "HighRep n", sortable: true },
	rank: { label: "Rank", sortable: true },
	lowRepRank: { label: "LowRep Rank", sortable: true },
	highRepRank: { label: "HighRep Rank", sortable: true },
};

/**
 * Functional table that displays the course survey responses stats
 */
export const StatsTable = () => {
	const course = useAtomValue(courseAtom);
	const setStatsModalAtomValue = useSetAtom(statsModalAtom);

	const { rankedStats } = useSurveyStats(course?.responses);

	const [sortKey, setSortKey] = useState<keyof TRankedSurveyStats>("rank");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">(
		"none"
	);

	const sortedStats = useMemo(() => {
		if (sortDirection === "none") return rankedStats;

		return [...rankedStats].sort((a, b) => {
			const aValue = a[sortKey];
			const bValue = b[sortKey];

			if (sortKey === "questionKey") {
				const aStr = typeof aValue === "string" ? aValue : "";
				const bStr = typeof bValue === "string" ? bValue : "";

				const aQuestion = getQuestionTextByKey(aStr);
				const bQuestion = getQuestionTextByKey(bStr);

				return sortDirection === "asc"
					? aQuestion.localeCompare(bQuestion)
					: bQuestion.localeCompare(aQuestion);
			}

			const aNum = typeof aValue === "number" ? aValue : -Infinity;
			const bNum = typeof bValue === "number" ? bValue : -Infinity;

			if (aNum === bNum) return 0;
			return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
		});
	}, [rankedStats, sortKey, sortDirection]);

	const handleSort = (key: keyof TRankedSurveyStats) => {
		if (sortKey === key) {
			setSortDirection((prev) => {
				if (prev === "asc") return "desc";
				if (prev === "desc") return "none";
				return "asc";
			});
		} else {
			setSortKey(key);
			setSortDirection("asc");
		}
	};

	const getSortArrow = (key: keyof TRankedSurveyStats) => {
		if (sortKey !== key) return null;
		if (sortDirection === "asc") return "▲";
		if (sortDirection === "desc") return "▼";
		return null;
	};

	const handleLowStatClick = (stats: TRankedSurveyStats) => {
		setStatsModalAtomValue({
			isOpen: true,
			stats: stats,
		});
	};

	const handleKeyDown = (e: React.KeyboardEvent, stat: TRankedSurveyStats) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleLowStatClick(stat);
		}
	};

	if (!course || sortedStats.length === 0) return null;

	const tableHeaderKeys = Object.keys(TABLE_HEADERS) as Array<
		keyof typeof TABLE_HEADERS
	>;

	return (
		<Card>
			<h2>Full Results</h2>
			<div className={styles.container}>
				<table>
					<thead>
						<tr>
							{tableHeaderKeys.map((key) => (
								<th
									key={key}
									onClick={() => TABLE_HEADERS[key].sortable && handleSort(key)}
									style={{
										cursor: TABLE_HEADERS[key].sortable ? "pointer" : "default",
									}}
								>
									{TABLE_HEADERS[key].label}
									{TABLE_HEADERS[key].sortable && getSortArrow(key)}
								</th>
							))}
						</tr>
					</thead>

					<tbody>
						{sortedStats.map((stat) => {
							const {
								questionKey,
								lowRepMedian,
								lowRepN,
								lowRepRank,
								highRepMedian,
								highRepN,
								highRepRank,
								n,
								rank,
								overallMedian,
							} = stat;

							const questionText = getQuestionTextByKey(questionKey);

							const containsLowMedian =
								overallMedian <= 5 || lowRepMedian <= 5 || highRepMedian <= 5;

							return (
								<tr
									key={questionKey}
									className={containsLowMedian ? styles.clickableRow : ""}
									onClick={
										containsLowMedian
											? () => handleLowStatClick(stat)
											: undefined
									}
									onKeyDown={
										containsLowMedian
											? (e) => handleKeyDown(e, stat)
											: undefined
									}
									role={containsLowMedian ? "button" : undefined}
									tabIndex={containsLowMedian ? 0 : undefined}
								>
									<td className={styles.questionCol}>
										{isPulseQuestion(questionText) && "🧡 "}

										{questionText}
									</td>

									<MedianCell value={overallMedian} />

									<MedianCell value={lowRepMedian} />

									<MedianCell value={highRepMedian} />

									<td>{n}</td>
									<td>{lowRepN}</td>
									<td>{highRepN}</td>
									<td>{rank}</td>
									<td>{lowRepRank}</td>
									<td>{highRepRank}</td>
								</tr>
							);
						})}
					</tbody>
				</table>

				<StatsModal />
			</div>
		</Card>
	);
};
