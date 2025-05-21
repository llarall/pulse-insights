import { courseAtom } from "@/atoms/courseAtom";
import {
	groupCoursesWithSurveyResponses,
	sanitizeCourses,
} from "@/utils/array";
import { parseSurveyResponsesFromFile } from "@/utils/file";
import { useSetAtom } from "jotai";
import { useRef, useState } from "react";
import { Card } from "../Card/Card";
import styles from "./UploadInput.module.css";

/**
 * Input for uploading the file by either clicking or dragging and dropping the .xls or .xlsx file
 */
export const UploadInput = () => {
	const setCourse = useSetAtom(courseAtom);

	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [error, setError] = useState<string | null>(null);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const uploadFile = async (file: File) => {
		try {
			const surveyResponses = await parseSurveyResponsesFromFile(file);
			const unsanitizedGroupCourses =
				groupCoursesWithSurveyResponses(surveyResponses);
			const groupedCourses = sanitizeCourses(unsanitizedGroupCourses);

			// Only supporting one right now
			if (groupedCourses.length > 0) {
				setError("There is more than one course in your files.");
				setCourse(groupedCourses[0]);
			}
			setError(null);
		} catch (error: unknown) {
			if (error instanceof Error) {
				setError(error.message);
			} else {
				setError(String(error));
			}
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files[0];
		if (file) {
			uploadFile(file);
		}
	};

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (file) {
			uploadFile(file);
			e.target.value = "";
		}
	};

	return (
		<Card centered>
			<div
				className={`${styles.dropArea} ${isDragging ? styles.dragOver : ""}`}
				onClick={handleClick}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<h2>Step 2:</h2>
				<p>
					Drag & drop your Excel file here or click to select.
					<br />
					Your analysis and full results should appear below.
				</p>
			</div>

			<input
				className={styles.input}
				ref={fileInputRef}
				type="file"
				accept=".xlsx,.xls"
				onChange={handleFileChange}
			/>

			{error && <h2 className="error">{error}</h2>}
		</Card>
	);
};
