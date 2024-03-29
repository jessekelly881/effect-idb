import { Effect } from "effect";
import { describe } from "vitest";
import * as IndexedDB from "@/IndexedDB";
import "./Option";
import { test } from "./utils";

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
	test("create db", (ctx) =>
		Effect.gen(function* (_) {
			const idb = yield* _(IndexedDB.IndexedDB);
			const db = yield* _(testDb);

			const databases = yield* _(idb.databases);

			ctx.expect(db.name).toBe("store");
			ctx.expect(db.version).toBe(1);
			ctx.expect(databases.map((db) => db.name)).toEqual(["store"]);
		}));

	test("create,delete", (ctx) =>
		Effect.gen(function* (_) {
			const idb = yield* _(IndexedDB.IndexedDB);
			yield* _(
				idb.open({
					name: "store"
				}),
				Effect.scoped
			);

			const dbsBefore = yield* _(idb.databases);
			ctx.expect(dbsBefore.map((db) => db.name)).toEqual(["store"]);

			yield* _(idb.deleteDatabase("store"));
			const dbsAfter = yield* _(idb.databases);
			ctx.expect(dbsAfter.map((db) => db.name)).toEqual([]);
		}));

	test("cmp", (ctx) =>
		Effect.gen(function* (_) {
			const idb = yield* _(IndexedDB.IndexedDB);

			ctx.expect(idb.cmp(1, 2)).toBe(-1);
			ctx.expect(idb.cmp("a", 2)).toBe(1);
			ctx.expect(idb.cmp(2, "a")).toBe(-1);
			ctx.expect(idb.cmp(1, 1)).toBe(0);
		}));

	test("transaction store names", (ctx) =>
		Effect.gen(function* (_) {
			const db = yield* _(testDb);
			const t = yield* _(db.transaction("readwrite", ["store"]));
			ctx.expect(t.objectStoreNames).toEqual(["store"]);
		}));

	test("get <None>", (ctx) =>
		Effect.gen(function* (_) {
			const db = yield* _(testDb);
			const t = yield* _(db.transaction("readwrite", ["store"]));
			const store = t.objectStore("store");
			const res = yield* _(store.get("none"));
			ctx.expect(res).toBeNone();
		}));

	test("add, get", (ctx) =>
		Effect.gen(function* (_) {
			const db = yield* _(testDb);
			const t = yield * _(db.transaction("readwrite", ["store"]));
			const store = t.objectStore("store");
			yield * _(store.add("val", "key1"));
			const res = yield * _(store.get("key1"));

			ctx.expect(res).toBeSome("val");
		}));

	test("add, clear, get <None>", (ctx) =>
		Effect.gen(function* (_) {
			const db = yield* _(testDb);
			const t = yield * _(db.transaction("readwrite", ["store"]));
			const store = t.objectStore("store");

			yield * _(store.add("val", "key1"));
			yield * _(store.clear);
			const res = yield * _(store.get("none"));
			ctx.expect(res).toBeNone();
		}));

	test("count", (ctx) =>
		Effect.gen(function* (_) {
			const db = yield* _(testDb);
			const t = yield * _(db.transaction("readwrite", ["store"]));
			const store = t.objectStore("store");

			const countBefore = yield * _(store.count);
			yield * _(store.add("val", "key1"));
			const countAfter = yield * _(store.count);

			ctx.expect(countBefore).toBe(0);
			ctx.expect(countAfter).toBe(1);
		}));

	test("put, get", (ctx) =>
		Effect.gen(function* (_) {
			const db = yield* _(testDb);
			const t = yield * _(db.transaction("readwrite", ["store"]));
			const store = t.objectStore("store");
			yield * _(store.put("val", "key1"));
			yield * _(store.put("val-new", "key1"));
			const res = yield * _(store.get("key1"));

			ctx.expect(res).toBeSome("val-new");
		}));
});
