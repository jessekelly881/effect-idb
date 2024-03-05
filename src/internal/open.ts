/**
 * @since 1.0.0
 */

import * as Error from "@/Error";
import type { Database, Update } from "@/IndexedDB";
import { transaction } from "@/internal/transaction";
import { Effect, Scope } from "effect";

/** @internal */
const update = (db: IDBDatabase): Update => ({
	version: db.version,
	name: db.name,
	transaction: transaction(db),
	createObjectStore: (name) =>
		Effect.try({
			try: () => db.createObjectStore(name),
			catch: () =>
				new Error.IndexedDBError({
					message: "Error creating object store"
				})
		})
});

/** @internal */
export const open = ({
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
		const db = yield* _(
			Effect.async<IDBDatabase, Error.IndexedDBError>((resume) => {
				const openRequest = indexedDB.open(name, version);

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
					openRequest.onupgradeneeded = async () =>
						await Effect.runPromise(
							onUpgrade(update(openRequest.result))
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

		return {
			transaction: transaction(db),
			version: db.version,
			name: db.name
		} satisfies Database;
	});
