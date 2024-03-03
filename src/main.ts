import { Console, Context, Effect, Layer, Scope } from "effect";
import * as Error from "./Error";
import * as Store from "./Store";
import { open } from "./internal/open";

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

Effect.gen(function* (_) {
	const idb = yield* _(IndexedDB);
	const db = yield* _(
		idb.open({
			name: "store21",
			version: 2,
			onUpgrade: (db) =>
				Effect.gen(function* (_) {
					yield* _(db.createObjectStore("store").pipe(Effect.orDie));
				})
		})
	);
	yield* _(
		db.transaction(["store"], ({ store }) =>
			Effect.all([store.add({ a: 1 }, "a")])
		)
	);
}).pipe(
	Effect.provide(layer),
	Effect.scoped,
	Effect.catchAllDefect((err) => Console.log(err)),
	Effect.andThen(() => Console.log("Finished")),
	Effect.runFork
);
