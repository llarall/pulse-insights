import { useEffect, useState } from "react";
import styles from "./App.module.css";
import { AnalysisInformation } from "./components/AnalysisInformation/AnalysisInformation";
import { CourseInformation } from "./components/CourseInformation/CourseInformation";
import { InfoSection } from "./components/InfoSection";
import { StatsTable } from "./components/StatsTable/StatsTable";
import { UploadInput } from "./components/UploadInput/UploadInput";
import { UploadInstructions } from "./components/UploadInstructions/UploadInstructions";
import {
	applyTheme,
	getInitialTheme,
	toggleTheme,
	type TTheme,
} from "./utils/theme";

export const App = () => {
	const [theme, setTheme] = useState<TTheme>(getInitialTheme());

	useEffect(() => {
		const root = document.documentElement;
		const initial = getInitialTheme();
		applyTheme(root, initial);
	}, []);

	const handleToggle = () => {
		const root = document.documentElement;
		setTheme(toggleTheme(root));
	};

	return (
		<div className={styles.container}>
			<header>
				<h1>🧡 PULSE Insights Tool v{__APP_VERSION__}</h1>
			</header>
			<main>
				<button onClick={handleToggle}>
					Switch to {theme === "dark" ? "Light" : "Dark"} Mode
				</button>

				<InfoSection />

				<UploadInstructions />

				<UploadInput />

				<CourseInformation />

				<AnalysisInformation />

				<StatsTable />
			</main>
		</div>
	);
};
