/**
 * @since 1.0.0
 */
import * as ObjectStore from "@/ObjectStore";
import type { Effect } from "effect";
import * as internal from "@/internal/transaction";
import { IndexedDBError } from "@/Error";

/**
 * @since 1.0.0
 */
export interface Transaction {
	objectStoreNames: DOMStringList;
	durability: IDBTransactionDurability;
	objectStore: (name: string) => ObjectStore.ObjectStore;
}

/**
 * @since 1.0.0
 */
export const make = (t: IDBTransaction): Transaction => ({
	objectStoreNames: t.objectStoreNames,
	durability: t.durability,
	objectStore: (name) => ObjectStore.make(t.objectStore(name))
});

/**
 * @since 1.0.0
 */
export const transaction: (
	idb: IDBDatabase
) => (
	mode: IDBTransactionMode,
	storeNames: string[]
) => Effect.Effect<Transaction, IndexedDBError, never> = internal.transaction;
