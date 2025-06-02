import { statsModalAtom } from "@/atoms/statsModalAtom";
import { decodeQuestion } from "@/utils/encoding";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import { Modal } from "../Modal/Modal";

export const StatsModal = () => {
	const [responseModalValue, setResponseModalValue] = useAtom(statsModalAtom);

	const { isOpen, stats } = responseModalValue || {};
	const { questionKey = "" } = stats || {};

	const question = decodeQuestion(questionKey);

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
				For the response <strong>{question}</strong>
			</p>
			<button onClick={onClose}>Close</button>
		</Modal>
	);
};
