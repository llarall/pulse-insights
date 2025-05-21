/**
 * Encodes a question string into a compact, Base64-safe string.
 * This is useful for storing arbitrary question text as object keys.
 */
export const encodeQuestion = (question: string): string => {
	const encoder = new TextEncoder();
	const bytes = encoder.encode(question);

	return btoa(String.fromCharCode(...bytes));
};
/**
 * Decodes an encoded question string back to its original form.
 */
export const decodeQuestion = (encoded: string): string => {
	const binary = atob(encoded);
	const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
	const decoder = new TextDecoder();
	return decoder.decode(bytes);
};
