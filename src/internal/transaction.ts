/**
 * @since 1.0.0
 */

import * as Error from "@/Error";
import * as Transaction from "@/Transaction";
import { Effect, Exit } from "effect";

/** @internal */
export const transaction =
	(idb: IDBDatabase) =>
	(
		mode: IDBTransactionMode,
		storeNames: string[]
	): Effect.Effect<Transaction.Transaction, Error.IndexedDBError> =>
		Effect.async((cb) => {
			const tx = idb.transaction(storeNames, mode);
			cb(Exit.succeed(Transaction.make(tx)));
		});
