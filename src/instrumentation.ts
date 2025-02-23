import { logger } from "./lib/logging";

const log = logger.child({ module: "instrumentation" });

export async function register(): Promise<void> {
	log.info("Registering instrumentation module");
	await (await import("@/lib/actions")).createTable();
	log.info("Instrumentation module registered successfully");
}
