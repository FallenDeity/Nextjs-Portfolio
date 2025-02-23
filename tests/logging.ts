import "mocha";

import * as assert from "assert";

import { logger } from "../src/lib/logging";

describe("index", (): void => {
	it("should say 'Hello, world!'", (): void => {
		logger.info("Hello, world!");
		assert.ok(true);
	});
});
