import { LINKS } from "@/constants/links";
import { useState } from "react";
import { Card } from "./Card/Card";

/**
 * Displays information regarding how the tool works
 */
export const InfoSection = () => {
	const [showMore, setShowMore] = useState(false);

	const toggleShowMore = () => setShowMore((prev) => !prev);

	return (
		<Card>
			<h2>About this Tool</h2>
			<p>
				This tool instantly analyzes{" "}
				<a href={LINKS.pulse} target="_blank">
					PULSE
				</a>{" "}
				and SLE survey data you provide. It compares responses from students who
				are less and more represented in their engineering programs. All data
				processing is done locally in your browser -{" "}
				<strong>no data is sent to or stored on any server</strong>.{" "}
				<a href="#" id="learnMore" onClick={toggleShowMore}>
					Show More About this Tool
				</a>
			</p>

			{showMore && (
				<div>
					<h3>Prerequisites</h3>
					<p>
						This tool will only work properly if you added the PULSE questions
						to your SLE. The PULSE questions are currently only available to
						College of Engineering faculty at Oregon State University.{" "}
						<a href={LINKS.pulseQuestions} target="_blank">
							How to add the questions / more information
						</a>
					</p>

					<h3>Can I see an example report?</h3>
					<p>
						<a href="example.pdf" target="_blank">
							Example of what this tool will output
						</a>
					</p>

					<h3>How it Works</h3>
					<p>
						The tool splits respondents into "LowRep" and "HighRep" groups based
						on their responses to the representation question. It then
						calculates statistics for each group and identifies significant
						differences in their experiences. Questions marked with 🧡 are PULSE
						questions related to student representation, success, completion,
						belonging, and satisfaction.
					</p>

					<h3>Methodology</h3>
					<p>
						When "median" appears in this tool, it refers to the interpolated
						median. The interpolated median accounts for ties in the data by
						using the distribution of responses around the middle value. This
						provides a more nuanced measure than a traditional median when
						working with Likert scale data.
					</p>

					<h3>Credits</h3>
					<p>Created by Claude (Anthropic) and Lara Letaw</p>
				</div>
			)}
		</Card>
	);
};
