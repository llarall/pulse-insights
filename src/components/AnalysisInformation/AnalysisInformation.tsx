import { courseAtom } from "@/atoms/courseAtom";
import { LINKS } from "@/constants/links";
import { useSurveyStats } from "@/hooks/useSurveyStats";
import { getQuestionTextByKey } from "@/utils/questionKeyMap";
import { calculateSummaryStats } from "@/utils/survey";
import { useAtomValue } from "jotai";
import { Card } from "../Card/Card";

/**
 * Displays the in-depth analysis on the response numbers
 */
export const AnalysisInformation = () => {
	const course = useAtomValue(courseAtom);

	const { rankedStats } = useSurveyStats(course?.responses);

	if (!rankedStats.length) return null;

	const summary = calculateSummaryStats(rankedStats);

	const topMedianQuestions = summary.topMedianDifferences.map((item) => {
		return (
			<li key={item.questionKey}>
				<strong>{getQuestionTextByKey(item.questionKey)}</strong> with a
				difference of <strong>{item.difference.toFixed(2)}</strong> (LowRep:{" "}
				<strong>{item.lowRepMedian.toFixed(2)}</strong>, HighRep:{" "}
				<strong>{item.highRepMedian.toFixed(2)}</strong>)
			</li>
		);
	});

	const topRankQuestions = summary.topRankDifferences.map((item) => {
		return (
			<li key={item.questionKey}>
				<strong>{getQuestionTextByKey(item.questionKey)}</strong> with a rank
				difference of <strong>{item.rankDifference}</strong> (LowRep rank:{" "}
				<strong>{item.lowRepRank}</strong>, HighRep rank:{" "}
				<strong>{item.highRepRank}</strong>)
			</li>
		);
	});

	return (
		<Card gray>
			<h2>Analysis</h2>
			<p>
				<em>Notes:</em> <strong>"LowRep"</strong> refers to less represented
				students (responses below or at the median for "Students like me are
				REPRESENTED in my engineering major/minor"). <strong>"HighRep"</strong>
				refers to more represented students (responses above the median).
				<strong>"Median" refers to the interpolated median</strong>, which is
				used by the SLE. <strong>Maximum median is 6.0</strong> (Strongly
				Agree).
			</p>

			<h3>In your results...</h3>
			<ul>
				<li>
					LowRep students responded less favorably than HighRep students for{" "}
					<strong>{summary.lowRepLessFavorablePct.toFixed(2)}%</strong> of the
					questions.
				</li>
				<li>
					HighRep students responded less favorably than LowRep students for{" "}
					<strong>{summary.highRepLessFavorablePct.toFixed(2)}%</strong> of the
					questions.
				</li>
				<li>
					LowRep and HighRep students responded the same for{" "}
					<strong>{summary.sameResponsePct.toFixed(2)}%</strong> of the
					questions.
				</li>
				<li>
					Top questions where LowRep and HighRep medians are farthest apart:
				</li>
				<ul>{topMedianQuestions}</ul>
				<li>
					Top questions where LowRep and HighRep ranks are farthest apart:
				</li>
				<ul>{topRankQuestions}</ul>
				<li>
					The average median for LowRep is{" "}
					<strong>{summary.averageLowRepMedian.toFixed(2)}</strong>.
				</li>
				<li>
					The average median for HighRep is{" "}
					<strong>{summary.averageHighRepMedian.toFixed(2)}</strong>.
				</li>
			</ul>

			<h3>What should I do based on these data?</h3>
			<p>
				If there are big differences between how your LowRep and HighRep
				students responded, consider where the largest gaps are and how you
				might address them. Contact the{" "}
				<a href={LINKS.emailEECSCommittee}>
					EECS Effective & Inclusive Teaching Practice Committee
				</a>{" "}
				or the{" "}
				<a href={LINKS.centerForTeachingAndLearning}>
					Center for Teaching and Learning
				</a>{" "}
				for ideas. Then, re-run this analysis for a future term to determine
				whether your change might have helped. Remember to{" "}
				<a href={LINKS.pulseQuestions}>use the PULSE questions</a> each term.
			</p>
		</Card>
	);
};
