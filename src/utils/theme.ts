export type TTheme = "light" | "dark";

const THEME_KEY = "theme";

/**
 * Gets the user's saved theme or falls back to dark mode by default.
 */
export const getInitialTheme = (): TTheme => {
	const stored = localStorage.getItem(THEME_KEY) as TTheme | null;
	if (stored === "dark" || stored === "light") return stored;

	// Default to dark when no preference has been saved.
	return "dark";
};

/**
 * Applies a theme by toggling classes on a given element.
 */
export const applyTheme = (element: Element, theme: TTheme): void => {
	element.classList.remove("theme-light", "theme-dark");
	element.classList.add(`theme-${theme}`);
	localStorage.setItem(THEME_KEY, theme);
};

/**
 * Toggles the theme and updates the target element.
 */
export const toggleTheme = (element: Element): TTheme => {
	const isDark = element.classList.contains("theme-dark");
	const newTheme: TTheme = isDark ? "light" : "dark";
	applyTheme(element, newTheme);
	return newTheme;
};
