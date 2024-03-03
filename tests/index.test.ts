import * as Error from "@/Error";
import * as IndexedDB from "@/index";
import { Effect, Scope } from "effect";
import "fake-indexeddb/auto";
import { TestContext, describe, it } from "vitest";

const test = <A>(
	name: string,
	fn: (
		ctx: TestContext
	) => Effect.Effect<
		A,
		Error.IndexedDBError,
		Scope.Scope | IndexedDB.IndexedDB
	>
) => {
	it(name, async (ctx) => {
		const res = await Effect.runPromiseExit(
			fn(ctx).pipe(
				Effect.scoped,
				Effect.provide(IndexedDB.layer),
				Effect.orDie
			)
		);
		ctx.expect(res._tag).toBe("Success");
	});
};

const testDb = Effect.flatMap(IndexedDB.IndexedDB, (db) =>
	db.open({
		name: "store",
		version: 1,
		onUpgrade: (db) =>
			Effect.gen(function* (_) {
				yield* _(db.createObjectStore("store").pipe(Effect.orDie));
			})
	})
);

describe("IndexedDB", () => {
	test("open", () =>
		Effect.gen(function* (_) {
			yield* _(testDb);
		}));

	test("add, get", (ctx) =>
		Effect.gen(function* (_) {
			const db = yield* _(testDb);
			const res = yield* _(
				db.transaction(["store"], ({ store }) =>
					Effect.all([store.add("hello", "key1"), store.get("key1")])
				)
			);

			ctx.expect(res[1]).toBe("hello");
		}));
});
