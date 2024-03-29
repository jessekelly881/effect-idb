/**
 * @since 1.0.0
 */

import * as Error from "@/Error";
import * as Transaction from "@/Transaction";
import { open } from "@/internal/open";
import { wrapRequest } from "@/utils";
import { Context, Effect, Layer, Scope, Order } from "effect";

/**
 * @category models
 * @since 1.0.0
 */
export interface Database {
	/**
	 * Database name
	 *
	 * @since 1.0.0
	 */
	name: string;

	/**
	 * Database version
	 *
	 * @since 1.0.0
	 */
	version: number;

	/**
	 * List of store names
	 *
	 * @since 1.0.0
	 */
	objectStoreNames: DOMStringList;

	/**
	 * Creates a transaction context.
	 *
	 * @since 1.0.0
	 */
	transaction: (
		mode: IDBTransactionMode,
		storeNames: string[]
	) => Effect.Effect<Transaction.Transaction, Error.IndexedDBError>;
}

/**
 * Database object w/ extended update capabilities only available during upgrade event.
 *
 * @category models
 * @since 1.0.0
 */
export interface Update extends Database {
	/**
	 * @since 1.0.0
	 */
	createObjectStore: (
		name: string
	) => Effect.Effect<IDBObjectStore, Error.IndexedDBError>;

	/**
	 * @since 1.0.0
	 */
	deleteObjectStore: (
		name: string
	) => Effect.Effect<void, Error.IndexedDBError>;
}

/**
 * Top level IndexedDB layer
 *
 * @category models
 * @since 1.0.0
 */
export class IndexedDB extends Context.Tag("effect-idb/IndexedDB")<
	IndexedDB,
	{
		/**
		 * Opens or creates a Database
		 * @since 1.0.0
		 */
		open: (options: {
			name: string;
			onUpgrade?: (db: Update) => Effect.Effect<void>;
			version?: number;
		}) => Effect.Effect<Database, Error.IndexedDBError, Scope.Scope>;

		/**
		 * Array of Database info
		 * @since 1.0.0
		 */
		databases: Effect.Effect<IDBDatabaseInfo[]>;

		/**
		 * Delete a Database. Will block until all connections are closed.
		 * @since 1.0.0
		 */
		deleteDatabase: (
			name: string
		) => Effect.Effect<void, Error.IndexedDBError>;

		/**
		 * Uses the IDBFactory.cmp function to compare two keys
		 *
		 * @type {Order.Order<IDBValidKey>}
		 * @since 1.0.0
		 */
		cmp: Order.Order<IDBValidKey>;
	}
>() {}

/**
 * Creates an IndexedDB layer from a given IDBFactory
 *
 * @since 1.0.0
 * @param {IDBFactory} factory
 */
export const layer = (factory: IDBFactory) =>
	Layer.succeed(
		IndexedDB,
		IndexedDB.of({
			open: open(factory),
			databases: Effect.promise(() => factory.databases()),
			deleteDatabase: (name: string) =>
				wrapRequest(
					() => factory.deleteDatabase(name),
					() =>
						new Error.IndexedDBError({
							message: "Couldn't delete database"
						})
				),
			cmp: Order.make((a, b) => factory.cmp(a, b) as -1 | 0 | 1) // FIXME: this is unsafe. factory.cmp can throw
		})
	);
