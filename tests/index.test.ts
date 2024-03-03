import * as IndexedDB from "@/index";
import { Effect } from "effect";
import "fake-indexeddb/auto";
import { describe, it } from "vitest";

describe("IndexedDB", () => {
	it("open", async () => {
		Effect.runPromise(
			Effect.gen(function* (_) {
				const db = yield* _(IndexedDB.IndexedDB);
				yield* _(
					db.open({
						name: "store",
						version: 1,
						onUpgrade: (db) =>
							Effect.gen(function* (_) {
								yield* _(
									db
										.createObjectStore("store")
										.pipe(Effect.orDie)
								);
							})
					})
				);
			}).pipe(
				Effect.scoped,
				Effect.provide(IndexedDB.layer),
				Effect.orDie
			)
		);
	});
});
