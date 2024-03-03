import { fc, test } from "@fast-check/vitest";
import { describe } from "vitest";

describe("tests", () => {
	test.prop([fc.integer(), fc.integer()])("add", (a, b) => {
		return a + b === b + a;
	});
});
