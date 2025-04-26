import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

import { createRequire } from "module";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");

export default defineConfig({
	base: "./",
	plugins: [react(), tsconfigPaths(), viteSingleFile()],
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version), // This is so we can display the app version from the package.json
	},
});
