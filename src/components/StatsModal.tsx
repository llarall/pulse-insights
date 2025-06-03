import { statsModalAtom } from "@/atoms/statsModalAtom";
import { getImprovementSuggestions } from "@/utils/questionImprovements";
import { getQuestionTextByKey } from "@/utils/questionKeyMap";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import { Modal } from "./Modal/Modal";

/*
 *	Displays information and suggestions regarding low value stats
 */
export const StatsModal = () => {
	const [responseModalValue, setResponseModalValue] = useAtom(statsModalAtom);

	const { isOpen, stats } = responseModalValue || {};
	const { questionKey = "" } = stats || {};

	const questionText = getQuestionTextByKey(questionKey);

	const onClose = () => {
		setResponseModalValue(RESET);
	};

	const improvement = getImprovementSuggestions(questionKey);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Understanding Your Response"
		>
			<strong>{questionText}</strong>

			{improvement && (
				<div className="improvement-panel">
					<p>
						Based on your data, this area could be improved. You can explore
						more here:{" "}
						{improvement?.link && (
							<a
								href={improvement.link}
								target="_blank"
								rel="noopener noreferrer"
							>
								UDL Guidance
							</a>
						)}
					</p>
					<ul>
						{improvement.suggestions.map((point, i) => (
							<li key={i}>{point}</li>
						))}
					</ul>
				</div>
			)}
		</Modal>
	);
};
