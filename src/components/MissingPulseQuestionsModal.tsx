import { LINKS } from "@/constants/links";
import { PULSE_QUESTIONS } from "@/constants/surveyQuestions";
import { Modal } from "./Modal/Modal";
import styles from "./MissingPulseQuestionsModal.module.css";

type TProps = {
	missingQuestions: string[];
	onClose: () => void;
};

/**
 * Warns that an uploaded file is missing PULSE questions, which the
 * LowRep / HighRep analysis depends on.
 */
export const MissingPulseQuestionsModal = ({
	missingQuestions,
	onClose,
}: TProps) => {
	const allMissing = missingQuestions.length === PULSE_QUESTIONS.length;

	return (
		<Modal
			isOpen={missingQuestions.length > 0}
			onClose={onClose}
			title="Missing PULSE questions"
		>
			<div className={styles.message}>
				<p>
					Most of this tool won't work without the PULSE questions. LowRep
					and HighRep comparisons, ranks, and the analysis all depend on
					them.
				</p>
				{allMissing ? (
					<p>This file doesn't include those questions.</p>
				) : (
					<>
						<p>This file is missing:</p>
						<ul>
							{missingQuestions.map((question) => (
								<li key={question}>{question}</li>
							))}
						</ul>
					</>
				)}
				<p>
					The PULSE questions are currently only available to College of
					Engineering faculty at Oregon State University.{" "}
					<a
						href={LINKS.pulseQuestions}
						target="_blank"
						rel="noopener noreferrer"
					>
						How to add the questions
					</a>
				</p>
			</div>
		</Modal>
	);
};
