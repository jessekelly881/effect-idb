import * as Error from "@/Error";
import * as Store from "@/Store";
import { open } from "@/internal/open";
import { Context, Effect, Layer, Scope } from "effect";

export interface Database {
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

export interface Update {
	createObjectStore: (
		name: string
	) => Effect.Effect<IDBObjectStore, Error.IndexedDBError>;
}

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

export const layer = Layer.succeed(
	IndexedDB,
	IndexedDB.of({
		open
	})
);
