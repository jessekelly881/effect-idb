/**
 * @since 1.0.0
 */

import { PlatformError } from "@effect/platform/Error";
import { Effect, Scope } from "effect";
import { IDBFactory } from "fake-indexeddb";
import { TestContext, it } from "vitest";
import * as Error from "../src/Error";
import * as IndexedDB from "../src/IndexedDB";

export const test = <A>(
	name: string,
	fn: (
		ctx: TestContext
	) => Effect.Effect<
		A,
		Error.IndexedDBError | PlatformError,
		Scope.Scope | IndexedDB.IndexedDB
	>
) => {
	const factory = new IDBFactory(); // create a fresh instance for each test
	const idbLayer = IndexedDB.layer(factory);

	it(name, async (ctx) => {
		const res = await Effect.runPromiseExit(
			fn(ctx).pipe(Effect.scoped, Effect.provide(idbLayer), Effect.orDie)
		);

		if (res._tag === "Failure") {
			throw res;
		}
	});
};
