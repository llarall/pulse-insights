import { AnalysisInformation } from "./components/AnalysisInformation/AnalysisInformation";
import { CourseInformation } from "./components/CourseInformation/CourseInformation";
import { InfoSection } from "./components/InfoSection";
import { StatsTable } from "./components/StatsTable/StatsTable";
import { UploadInput } from "./components/UploadInput/UploadInput";
import { UploadInstructions } from "./components/UploadInstructions/UploadInstructions";

export const App = () => {
	return (
		<main>
			<h1>🧡 PULSE Insights Tool v{__APP_VERSION__}</h1>

			<p>test</p>

			<InfoSection />

			<UploadInstructions />

			<UploadInput />

			<CourseInformation />

			<AnalysisInformation />

			<StatsTable />
		</main>
	);
};
