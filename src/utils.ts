/**
 * @since 1.0.0
 */

import { Effect } from "effect";

/**
 * Convers an IDBRequest into an Effect
 * @since 1.0.0
 */
export const wrapRequest = <T, A, E, R>(
	request: () => IDBRequest<T>,
	onError: (err: DOMException | null) => Effect.Effect<A, E, R>
) =>
	Effect.async<A | T, E, R>((resume) => {
		const r = request();
		r.onsuccess = () => {
			resume(Effect.succeed(r.result));
		};
		r.onerror = () => {
			resume(onError(r.error));
		};
	});
