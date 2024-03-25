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
					Effect.gen(function* (_) {
						const t = yield* _(
							db.transaction("readwrite", [storeName])
						);
						const store = t.objectStore(storeName);
						yield* _(store.put(value, key));
					}).pipe(Effect.orDie), // FIXME: Map to PlatformError

				get: (key) =>
					Effect.gen(function* (_) {
						const t = yield* _(
							db.transaction("readonly", [storeName])
						);
						const store = t.objectStore(storeName);
						const res = yield* _(store.get(key));
						return res as Option.Option<string>; // FIXME: No guarantee that this is a string.
					}).pipe(Effect.orDie), // FIXME: Map to PlatformError

				remove: (key) =>
					Effect.gen(function* (_) {
						const t = yield* _(
							db.transaction("readwrite", [storeName])
						);
						const store = t.objectStore(storeName);
						yield* _(store.delete(key));
					}).pipe(Effect.orDie), // FIXME: Map to PlatformError

				size: Effect.gen(function* (_) {
					const t = yield* _(db.transaction("readonly", [storeName]));
					const store = t.objectStore(storeName);
					return yield* _(store.count);
				}).pipe(Effect.orDie), // FIXME: Map to PlatformError

				clear: Effect.gen(function* (_) {
					const t = yield* _(
						db.transaction("readwrite", [storeName])
					);
					const store = t.objectStore(storeName);
					yield* _(store.clear);
				}).pipe(Effect.orDie) // FIXME: Map to PlatformError
			});
		})
	);
