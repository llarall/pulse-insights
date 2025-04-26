import { SURVEY_QUESTIONS_MAP } from "@/constants/surveyQuestions";
import type { TRow, TSurveyResponse } from "@/types/shared";
import { surveyResponseValidator } from "@/validators/surveyResponseValidator";
import { read, utils } from "xlsx";

/**
 * Normalizes a header string into camelCase format for internal usage.
 * Removes punctuation, converts to lowercase, and formats spacing.
 */
export const normalizeHeader = (header: string): string => {
	return header
		.toLowerCase()
		.replace(/["'.()]/g, "")
		.replace(/[^a-z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
		.replace(/^[^a-zA-Z]+/, "")
		.replace("#", "");
};

/**
 * Parses sheet rows from a spreadsheet into validated survey responses.
 * Filters out empty rows and normalizes headers before validation.
 */
export const parseSheetRowsToResponses = (rows: TRow[]): TSurveyResponse[] => {
	if (rows.length === 0) return [];

	const [headerRow, ...dataRows] = rows;

	const validDataRows = dataRows.filter(
		(row) =>
			Array.isArray(row) && row.some((cell) => cell !== null && cell !== "")
	);

	return validDataRows.map((dataRow) => {
		const obj: Record<string, unknown> = {};

		dataRow.forEach((value, index) => {
			const rawHeader = headerRow[index];

			const internalKey = Object.entries(SURVEY_QUESTIONS_MAP).find(
				([, text]) => text === rawHeader
			)?.[0];

			const mappedKey = internalKey ?? normalizeHeader(rawHeader);

			obj[mappedKey] = value;
		});

		return surveyResponseValidator.parse(obj);
	});
};

/**
 * Parses survey responses from an uploaded file.
 * Reads all sheets, extracts rows, and returns cleaned, validated responses.
 */
export const parseSurveyResponsesFromFile = async (
	file: File
): Promise<TSurveyResponse[]> => {
	const arrayBuffer = await file.arrayBuffer();

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
