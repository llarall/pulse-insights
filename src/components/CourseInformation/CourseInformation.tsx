import { courseAtom } from "@/atoms/courseAtom";
import { useAtomValue } from "jotai";
import { Card } from "../Card/Card";
import styles from "./CourseInformation.module.css";

/**
 * Displays the course information gathered from the .xlsx document
 */
export const CourseInformation = () => {
	const course = useAtomValue(courseAtom);

	if (!course) return null;

	const { number, courseName, firstName, lastName, subject, term } =
		course || {};

	return (
		<Card gray>
			<h2>Course Information</h2>
			<table className={styles.table}>
				<tbody>
					<tr>
						<th>Course</th>
						<td>{`${subject}${number}: ${courseName}`}</td>
					</tr>
					<tr>
						<th>Term</th>
						<td>{term}</td>
					</tr>
					<tr>
						<th>Instructor</th>
						<td>{`${firstName} ${lastName}`}</td>
					</tr>
				</tbody>
			</table>
		</Card>
	);
};
