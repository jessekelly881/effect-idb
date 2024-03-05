/**
 * @since 1.0.0
 */

import * as Error from "@/Error";
import * as Store from "@/Store";
import { wrapRequest } from "@/utils";
import { Effect, Option, ReadonlyRecord } from "effect";

/** @internal */
export const transaction =
	(idb: IDBDatabase) =>
	<I, R, Stores extends string[], Actions extends Store.Action[]>(
		stores: Stores,
		program: (
			_: Record<Stores[number], Store.Store>
		) => Effect.Effect<Actions, I, R>
	): Effect.Effect<Store.ReturnMap<Actions>, I | Error.IndexedDBError, R> =>
		Effect.gen(function* (_) {
			const actions = yield* _(
				program(
					ReadonlyRecord.fromIterableWith(stores, (store) => [
						store,
						Store.createStore(store)
					])
				)
			);

			const t = yield* _(
				Effect.try({
					try: () => idb.transaction(stores, "readwrite"),
					catch: () =>
						new Error.IndexedDBError({
							message: ""
						})
				})
			);

			const storeHandles = ReadonlyRecord.fromIterableWith(
				stores,
				(store) => [store, t.objectStore(store)]
			);

			const ret = yield* _(
				Effect.all(
					actions.map((action) => {
						const store = storeHandles[action.store];

						switch (action._op) {
							case "Add": {
								return wrapRequest(
									() => store.add(action.value, action.key),
									() =>
										new Error.IndexedDBError({
											message:
												"Error adding value to store"
										})
								);
							}

							case "Get": {
								return wrapRequest(
									() => store.get(action.key),
									() =>
										new Error.IndexedDBError({
											message:
												"Error getting value from store"
										})
								).pipe(Effect.map(Option.fromNullable));
							}

							case "Delete": {
								return wrapRequest(
									() => store.delete(action.key),
									() =>
										new Error.IndexedDBError({
											message:
												"Error getting value from store"
										})
								);
							}
						}
					})
				)
			);

			return ret as Store.ReturnMap<Actions>;
		});
