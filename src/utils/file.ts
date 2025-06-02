import { REQUIRED_HEADERS_MAP } from "@/constants/surveyQuestions";
import type {
	TRow,
	TSurveyResponse,
	TUnsanitizedSurveyResponse,
} from "@/types/shared";
import { surveyResponseValidator } from "@/validators/surveyResponseValidator";
import { read, utils } from "xlsx";
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
	const arrayBuffer = await file.arrayBuffer();

	// clear question key map
	resetQuestionMap();

	const workbook = read(arrayBuffer, {
		cellStyles: true,
		cellFormula: true,
		cellDates: true,
		cellNF: true,
		sheetStubs: true,
	});

	const { Sheets: sheets = {} } = workbook || {};

	return Object.values(sheets).flatMap((sheet): TSurveyResponse[] => {
		const rows = utils.sheet_to_json<TRow>(sheet, {
			header: 1,
			defval: null,
			raw: false,
		});

		return parseSheetRowsToResponses(rows);
	});
};
