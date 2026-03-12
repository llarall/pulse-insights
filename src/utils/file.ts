import { REQUIRED_HEADERS_MAP } from "@/constants/surveyQuestions";
import type {
	TRow,
	TSurveyResponse,
	TUnsanitizedSurveyResponse,
} from "@/types/shared";
import { surveyResponseValidator } from "@/validators/surveyResponseValidator";
import readXlsxFile, { readSheetNames } from "read-excel-file/browser";
import { getOrCreateQuestionKey, resetQuestionMap } from "./questionKeyMap";

/**
 * Parses sheet rows from a spreadsheet into validated survey responses.
 */
export const parseSheetRowsToResponses = (rows: TRow[]): TSurveyResponse[] => {
	if (rows.length === 0) return [];

	const [headerRow, ...dataRows] = rows;

	const requiredHeadersKeys = Object.keys(REQUIRED_HEADERS_MAP);
	const hasAllRequiredHeaders = requiredHeadersKeys.every((required) =>
		headerRow.includes(required)
	);

	if (!hasAllRequiredHeaders) return [];

	return dataRows.map((dataRow) => {
		const obj: TUnsanitizedSurveyResponse = {};

		dataRow.forEach((value, index) => {
			const rawHeader = headerRow[index];

			const requiredHeader = REQUIRED_HEADERS_MAP[rawHeader];
			const key = requiredHeader ?? getOrCreateQuestionKey(rawHeader);

			obj[key] = value;
		});

		return surveyResponseValidator.parse(obj) as TSurveyResponse;
	});
};

/**
 * Parses survey responses from an uploaded file.
 * Reads all sheets, extracts rows, and returns responses
 */
export const parseSurveyResponsesFromFile = async (
	file: File
): Promise<TSurveyResponse[]> => {
	// clear question key map
	resetQuestionMap();

	// Read all sheet names from the Excel file and aggregate rows from each sheet
	const sheetNames = await readSheetNames(file);

	if (!sheetNames || sheetNames.length === 0) return [];

	const allRows = await Promise.all(
		sheetNames.map((sheetName) =>
			readXlsxFile(file, { sheet: sheetName })
		)
	);

	return allRows.flatMap((rows) =>
		parseSheetRowsToResponses(rows as TRow[])
	);
};
