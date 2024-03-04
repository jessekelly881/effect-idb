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
	 * @since 1.0.0
	 */
	transaction: <
		I,
		R,
		Stores extends string[],
		Actions extends Store.Action[]
	>(
		stores: Stores,
		program: (
			_: Record<Stores[number], Store.Store>
		) => Effect.Effect<Actions, I, R>
	) => Effect.Effect<Store.ReturnMap<Actions>, I | Error.IndexedDBError, R>;
}

/**
 * @category models
 * @since 1.0.0
 */
export interface Update {
	/**
	 * @since 1.0.0
	 */
	createObjectStore: (
		name: string
	) => Effect.Effect<IDBObjectStore, Error.IndexedDBError>;
}

/**
 * Top level IndexedDB layer
 *
 * @category models
 * @since 1.0.0
 */
export class IndexedDB extends Context.Tag("IndexedDB")<
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
 * @category layers
 * @since 1.0.0
 */
export const layer = Layer.succeed(
	IndexedDB,
	IndexedDB.of({
		open
	})
);
