/**
 * @since 1.0.0
 */
import { Effect } from "effect";

/**
 * @since 1.0.0
 */
class Transaction extends Effect.Tag("Transaction")<
	Transaction,
	{
		objectStoreNames: DOMStringList;
		durability: IDBTransactionDurability;
		objectStore: (name: string) => IDBObjectStore;
	}
>() {}

/**
 * @since 1.0.0
 */
export const make = (t: IDBTransaction) =>
	Transaction.of({
		objectStoreNames: t.objectStoreNames,
		durability: t.durability,
		objectStore: t.objectStore
	});
