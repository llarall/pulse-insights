import howtoGif from "@/assets/howto.gif";
import { LINKS } from "@/constants/links";
import { useState } from "react";
import { Card } from "../Card/Card";
import styles from "./UploadInstructions.module.css";

const INSTRUCTIONS = [
	"Check the checkboxes next to the course/sections for which you want to export SLE data",
	'Select the "You have X items in your batch..." link that\'s near the top of the page',
	'On the Batch Download popup, select "An Excel File" as the Output Type',
	"Download the file once the export is complete<",
];

/**
 * Displays the instructions for how to export your data for the upload process
 */
export const UploadInstructions = () => {
	const [showInstruction, setShowInstructions] = useState(false);

	const toggleInstructions = () => setShowInstructions((prev) => !prev);

	return (
		<Card centered>
			<h2>Step 1 of 2</h2>
			<p>
				Export your SLE data as an Excel file.{" "}
				<button
					className="linkButton"
					type="button"
					onClick={toggleInstructions}
				>
					Show Instructions
				</button>
			</p>
			{showInstruction && (
				<div>
					<img src={howtoGif} />
					<div className={styles.instructions}>
						<ol>
							<li>
								Log in to the{" "}
								<a href={LINKS.sleLogin} target="_blank">
									SLE system
								</a>{" "}
								(opens in a new tab)
							</li>
							{INSTRUCTIONS.map((instruction, index) => (
								<li key={index}>{instruction}</li>
							))}
						</ol>
					</div>
				</div>
			)}
		</Card>
	);
};
