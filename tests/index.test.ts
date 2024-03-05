import { Effect, Option, Scope } from "effect";
import "fake-indexeddb/auto";
import { TestContext, describe, it } from "vitest";
import * as Error from "../src/Error";
import { IndexedDB } from "../src/index";

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

		if (res._tag === "Failure") {
			throw res;
		}
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
	test("name, version", (ctx) =>
		Effect.gen(function* (_) {
			const db = yield* _(testDb);
			ctx.expect(db.name).toBe("store");
			ctx.expect(db.version).toBe(1);
		}));

	test("get <None>", (ctx) =>
		Effect.gen(function* (_) {
			const db = yield* _(testDb);
			const res = yield* _(
				db.transaction(["store"], ({ store }) =>
					Effect.all([store.get("key1")])
				)
			);

			ctx.expect(res[0]).toBe(Option.none());
		}));

	test("add, get", (ctx) =>
		Effect.gen(function* (_) {
			const db = yield* _(testDb);
			const res = yield* _(
				db.transaction(["store"], ({ store }) =>
					Effect.all([store.add("val", "key1"), store.get("key1")])
				)
			);

			ctx.expect(res[1]).toEqual(Option.some("val"));
		}));
});
