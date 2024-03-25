/**
 * @since 1.0.0
 */

import * as Error from "@/Error";
import type { Database, Update } from "@/IndexedDB";
import { transaction } from "@/Transaction";
import { Effect, FiberSet, Scope } from "effect";

const createDatabase = (db: IDBDatabase): Database => ({
	version: db.version,
	name: db.name,
	objectStoreNames: db.objectStoreNames,
	transaction: transaction(db)
});

/** @internal */
const createUpdateDatabase = (db: IDBDatabase): Update => ({
	...createDatabase(db),
	createObjectStore: (name) =>
		Effect.try({
			try: () => db.createObjectStore(name),
			catch: () =>
				new Error.IndexedDBError({
					message: "Error creating object store"
				})
		}),

	deleteObjectStore: (name) =>
		Effect.try({
			try: () => db.deleteObjectStore(name),
			catch: () =>
				new Error.IndexedDBError({
					message: "Error creating object store"
				})
		})
});

/** @internal */
export const open =
	(factory: IDBFactory) =>
	({
		name,
		onUpgrade,
		version
	}: {
		name: string;
		onUpgrade?: (db: Update) => Effect.Effect<void, Error.IndexedDBError>;
		version?: number;
	}): Effect.Effect<Database, Error.IndexedDBError, Scope.Scope> =>
		Effect.gen(function* (_) {
			const scope = yield* _(Scope.Scope);
			const run = yield* _(FiberSet.makeRuntime<never>());
			const db = yield* _(
				Effect.async<IDBDatabase, Error.IndexedDBError>((resume) => {
					const openRequest = factory.open(name, version);

					openRequest.onerror = () => {
						resume(
							new Error.IndexedDBError({
								message: "Failed to open"
							})
						);
					};

					openRequest.onblocked = () => {
						resume(
							new Error.IndexedDBError({
								message: "Blocked"
							})
						);
					};

					openRequest.onsuccess = () => {
						resume(Effect.succeed(openRequest.result));
					};

					if (onUpgrade) {
						openRequest.onupgradeneeded = () =>
							run(
								onUpgrade(
									createUpdateDatabase(openRequest.result)
								)
							);
					}
				})
			);

			yield* _(
				Scope.addFinalizer(
					scope,
					Effect.sync(() => db.close())
				)
			);

			return createDatabase(db);
		});
