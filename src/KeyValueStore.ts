/**
 * A key-value store built ontop of a managed IndexedDB database.
 *
 * @since 1.0.0
 */

import { Error, IndexedDB } from "@/index";
import { KeyValueStore } from "@effect/platform";
import { Effect, Layer, Option } from "effect";

/**
 * Create a key-value store layer.
 *
 * @since 1.0.0
 */
export const layer = (
	dbName: string,
	storeName: string
): Layer.Layer<
	KeyValueStore.KeyValueStore,
	Error.IndexedDBError,
	IndexedDB.IndexedDB
> =>
	Layer.scoped(
		KeyValueStore.KeyValueStore,
		Effect.gen(function* (_) {
			const idb = yield* _(IndexedDB.IndexedDB);

			// version to use when opening db bumps version if store doesn't exist
			const version = yield* _(
				idb.open({
					name: dbName
				}),
				Effect.map((db) =>
					db.objectStoreNames.contains(storeName)
						? db.version
						: db.version + 1
				),
				Effect.scoped
			);

			const db = yield* _(
				idb.open({
					name: dbName,
					version,
					onUpgrade: (db) =>
						Effect.gen(function* (_) {
							// Create the store if it doesn't exist
							if (!db.objectStoreNames.contains(storeName)) {
								yield* _(
									db
										.createObjectStore(storeName)
										.pipe(Effect.orDie) // TODO: Handle this better
								);
							}
						})
				})
			);

			return KeyValueStore.make({
				set: (key, value) =>
					db
						.transaction(
							[storeName],
							(store) =>
								Effect.all([store[storeName].add(value, key)]) // FIXME: Use put instead of add
						)
						.pipe(
							Effect.map((as) => as[0]),
							Effect.scoped,
							Effect.orDie // FIXME: Map to PlatformError
						),

				get: (key) =>
					db
						.transaction([storeName], (store) =>
							Effect.all([store[storeName].get(key)])
						)
						.pipe(
							Effect.map((as) => as[0] as Option.Option<string>),
							Effect.scoped,
							Effect.orDie // FIXME: Map to PlatformError
						),
				remove: (key) =>
					db
						.transaction(
							[storeName],
							(store) =>
								Effect.all([store[storeName].delete(key)]) // FIXME: Use put instead of add
						)
						.pipe(
							Effect.map((as) => as[0]),
							Effect.scoped,
							Effect.orDie // FIXME: Map to PlatformError
						),

				size: Effect.succeed(0), // FIXME: Implement. IDBObjectStore.count()
				clear: Effect.succeed(undefined) // FIXME: Implement. IDBObjectStore.clear()
			});
		})
	);
