/**
 * @since 1.0.0
 */

import * as Error from "@/Error";
import * as Store from "@/Store";
import { open } from "@/internal/open";
import { Context, Effect, Layer, Scope } from "effect";

/**
 * @category models
 * @since 1.0.0
 */
export interface Database {
	/**
	 * Database name
	 * @since 1.0.0
	 */
	name: string;

	/**
	 * Database version
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
	 * @since 1.0.0
	 */
	transaction: <
		I,
		R,
		const Stores extends string[],
		Actions extends Store.Action[]
	>(
		stores: Stores,
		program: (
			_: Record<Stores[number], Store.Store>
		) => Effect.Effect<Actions, I, R>
	) => Effect.Effect<
		Store.ReturnMap<Actions>,
		I | Error.IndexedDBError,
		R | Scope.Scope
	>;
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
	}
>() {}

/**
 * Creates an IndexedDB layer from a given IDBFactory
 *
 * @param factory IDBFactory
 * @returns
 */
export const createLayer = (factory: IDBFactory) =>
	Layer.succeed(
		IndexedDB,
		IndexedDB.of({
			open: open(factory)
		})
	);
