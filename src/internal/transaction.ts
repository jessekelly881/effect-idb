/**
 * @since 1.0.0
 */

import * as Error from "@/Error";
import * as Store from "@/Store";
import { wrapRequest } from "@/utils";
import { Effect, Exit, Option, ReadonlyRecord, Scope } from "effect";

/**
 * @since 1.0.0
 */
export const createStore = (store: string): Store.Store => ({
	// Actions
	add: Store.add(store),
	get: Store.get(store),
	delete: Store.delete(store),
	clear: Store.clear(store)
});

/** @internal */
export const transaction =
	(idb: IDBDatabase) =>
	<I, R, Stores extends string[], Actions extends Store.Action[]>(
		stores: Stores,
		program: (
			_: Record<Stores[number], Store.Store>
		) => Effect.Effect<Actions, I, R>
	): Effect.Effect<
		Store.ReturnMap<Actions>,
		I | Error.IndexedDBError,
		R | Scope.Scope
	> =>
		Effect.gen(function* (_) {
			const actions = yield* _(
				program(
					ReadonlyRecord.fromIterableWith(stores, (store) => [
						store,
						createStore(store)
					])
				)
			);

			const t = yield* _(
				Effect.acquireRelease(
					Effect.try({
						try: () => idb.transaction(stores, "readwrite"),
						catch: () =>
							new Error.IndexedDBError({
								message: ""
							})
					}),

					// Abort transaction on interrupt
					(t, exit) =>
						Exit.isInterrupted(exit)
							? Effect.sync(() => t.abort())
							: Effect.unit
				)
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

							case "Clear": {
								return wrapRequest(
									() => store.clear(),
									() =>
										new Error.IndexedDBError({
											message: "Error clearing store"
										})
								);
							}
						}
					})
				)
			);

			// Wait for transaction.oncomplete
			yield* _(
				Effect.async((resume) => {
					t.oncomplete = () => {
						resume(Effect.succeed(null));
					};
				})
			);

			return ret as Store.ReturnMap<Actions>;
		});
