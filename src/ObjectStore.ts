/**
 * @since 1.0.0
 */

import { IndexedDBError } from "@/Error";
import { wrapRequest } from "@/utils";
import { Effect, Option, Context } from "effect";

export interface ObjectStore {
	get: (
		key: IDBValidKey
	) => Effect.Effect<Option.Option<any>, IndexedDBError>;
	clear: Effect.Effect<void, IndexedDBError>;
	count: Effect.Effect<number, IndexedDBError>;
	put: (
		value: any,
		key?: IDBValidKey
	) => Effect.Effect<IDBValidKey, IndexedDBError>;
	add: (
		value: any,
		key?: IDBValidKey
	) => Effect.Effect<IDBValidKey, IndexedDBError>;
	delete: (
		key: IDBValidKey | IDBKeyRange
	) => Effect.Effect<void, IndexedDBError>;
}

export const ObjectStore = Context.GenericTag<ObjectStore>("ObjectStore");

export const make = (idbStore: IDBObjectStore): ObjectStore => ({
	get: (key: IDBValidKey) =>
		wrapRequest(
			() => idbStore.get(key),
			(err) => Effect.fail(err)
		).pipe(
			Effect.map((val) => Option.fromNullable(val)),
			Effect.catchAll((s) =>
				s?.NOT_FOUND_ERR
					? Effect.succeed(Option.none())
					: new IndexedDBError({ message: "" })
			)
		),

	clear: wrapRequest(
		() => idbStore.clear(),
		() => new IndexedDBError({ message: "" })
	),

	count: wrapRequest(
		() => idbStore.count(),
		() => new IndexedDBError({ message: "" })
	),

	put: (value, key) =>
		wrapRequest(
			() => idbStore.put(value, key),
			() => new IndexedDBError({ message: "" })
		),

	delete: (keyOrRange) =>
		wrapRequest(
			() => idbStore.delete(keyOrRange),
			() => new IndexedDBError({ message: "" })
		),

	add: (value, key) =>
		wrapRequest(
			() => idbStore.add(value, key),
			() => new IndexedDBError({ message: "" })
		)
});
