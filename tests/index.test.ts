import { Effect, Option, Scope } from "effect";
import { TestContext, describe, it } from "vitest";
import * as Error from "../src/Error";
import * as IndexedDB from "../src/IndexedDB";
import { IDBFactory } from "fake-indexeddb";
import "./Option";

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
	test("creates db", (ctx) =>
		Effect.gen(function* (_) {
			const idb = yield* _(IndexedDB.IndexedDB);
			const db = yield* _(testDb);

			const databases = yield* _(idb.databases);

			ctx.expect(db.name).toBe("store");
			ctx.expect(db.version).toBe(1);
			ctx.expect(
				databases.find((db) => db.name === "store")
			).toBeTruthy();
		}));

	test("get <None>", (ctx) =>
		Effect.gen(function* (_) {
			const db = yield* _(testDb);
			const res = yield* _(
				db.transaction(["store"], ({ store }) =>
					Effect.all([store.get("key1")])
				)
			);

			ctx.expect(res[0]).toBeNone();
		}));

	test("add, get", (ctx) =>
		Effect.gen(function* (_) {
			const db = yield* _(testDb);
			const res = yield* _(
				db.transaction(["store"], ({ store }) =>
					Effect.all([store.add("val", "key1"), store.get("key1")])
				)
			);

			ctx.expect(res[1]).toBeSome("val");
		}));
});
