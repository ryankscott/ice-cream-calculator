import { fileURLToPath } from "node:url";

import AppDataSource from "./data-source";
import { createApp } from "./http/app";

const DEFAULT_PORT = Number(process.env.PORT ?? 4000);

export async function startServer(port = DEFAULT_PORT) {
	if (!AppDataSource.isInitialized) {
		await AppDataSource.initialize();
		await AppDataSource.runMigrations();
	}

	const app = createApp(AppDataSource);

	return app.listen(port, () => {
		console.log(`🚀 API ready at http://localhost:${port}`);
	});
}

// Allow `pnpm server:start` to run the server directly.
const isDirectExecution =
	typeof process.argv[1] === "string" &&
	fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectExecution) {
	startServer().catch((error) => {
		console.error("Failed to start server", error);
		process.exit(1);
	});
}
