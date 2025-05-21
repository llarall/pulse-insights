import { courseAtom } from "@/atoms/courseAtom";
import { useSurveyStats } from "@/hooks/useSurveyStats";
import type { TRankedSurveyStats } from "@/types/shared";
import { isPulseQuestion } from "@/utils/survey";
import { useAtomValue } from "jotai";
import { useMemo, useState } from "react";
import { Card } from "../Card/Card";
import styles from "./StatsTable.module.css";

const TABLE_HEADERS: Record<
	keyof Omit<TRankedSurveyStats, "questionKey">,
	{ label: string; sortable: boolean }
> = {
	questionText: { label: "Question", sortable: true },
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

			if (sortKey === "questionText") {
				const aStr = typeof aValue === "string" ? aValue : "";
				const bStr = typeof bValue === "string" ? bValue : "";
				return sortDirection === "asc"
					? aStr.localeCompare(bStr)
					: bStr.localeCompare(aStr);
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
						{sortedStats.map(
							({
								questionKey,
								lowRepMedian,
								lowRepN,
								lowRepRank,
								highRepMedian,
								highRepN,
								highRepRank,
								questionText,
								n,
								rank,
								overallMedian,
							}) => (
								<tr key={questionKey}>
									<td className={styles.questionCol}>
										{isPulseQuestion(questionText) && "🧡 "}

										{questionText}
									</td>
									<td
										className={
											overallMedian && overallMedian <= 5 ? styles.lowValue : ""
										}
									>
										{overallMedian?.toFixed(2) ?? "—"}
									</td>

									<td
										className={
											lowRepMedian && lowRepMedian <= 5 ? styles.lowValue : ""
										}
									>
										{lowRepMedian?.toFixed(2) ?? "—"}
									</td>

									<td
										className={
											highRepMedian && highRepMedian <= 5 ? styles.lowValue : ""
										}
									>
										{highRepMedian?.toFixed(2) ?? "—"}
									</td>
									<td>{n}</td>
									<td>{lowRepN}</td>
									<td>{highRepN}</td>
									<td>{rank}</td>
									<td>{lowRepRank}</td>
									<td>{highRepRank}</td>
								</tr>
							)
						)}
					</tbody>
				</table>
			</div>
		</Card>
	);
};
