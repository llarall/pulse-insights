import { statsModalAtom } from "@/atoms/statsModalAtom";
import { getQuestionTextByKey } from "@/utils/questionKeyMap";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import { Modal } from "../Modal/Modal";

export const StatsModal = () => {
	const [responseModalValue, setResponseModalValue] = useAtom(statsModalAtom);

	const { isOpen, stats } = responseModalValue || {};
	const { questionKey = "" } = stats || {};

	const questionText = getQuestionTextByKey(questionKey);

	const onClose = () => {
		setResponseModalValue(RESET);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Understanding Your Response"
		>
			<p>
				For the response <strong>{questionText}</strong>
			</p>
			<button onClick={onClose}>Close</button>
		</Modal>
	);
};
