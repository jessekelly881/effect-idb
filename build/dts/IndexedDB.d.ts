import * as Error from "@/Error";
import * as Store from "@/Store";
import { Context, Effect, Layer, Scope } from "effect";
export interface Database {
    transaction: <I, R, Stores extends string[], Actions extends Store.Action[]>(stores: Stores, program: (_: Record<Stores[number], Store.Store>) => Effect.Effect<Actions, I, R>) => Effect.Effect<Store.ReturnMap<Actions>, I | Error.IndexedDBError, R>;
}
export interface Update {
    createObjectStore: (name: string) => Effect.Effect<IDBObjectStore, Error.IndexedDBError>;
}
declare const IndexedDB_base: Context.TagClass<IndexedDB, "IndexedDB", {
    open: (options: {
        name: string;
        onUpgrade?: ((db: Update) => Effect.Effect<void>) | undefined;
        version?: number | undefined;
    }) => Effect.Effect<Database, Error.IndexedDBError, Scope.Scope>;
}>;
export declare class IndexedDB extends IndexedDB_base {
}
export declare const layer: Layer.Layer<IndexedDB, never, never>;
export {};
//# sourceMappingURL=IndexedDB.d.ts.map