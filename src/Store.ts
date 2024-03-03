/**
 * @since 1.0.0
 */

import { Effect } from "effect";

/** @internal */
export declare namespace Action {
	/**
	 * @since 1.0.0
	 * @category model
	 */
	export interface Proto {
		_tag: "Action";
		store: string;
	}
}

/** @internal */
export interface Add extends Action.Proto {
	_op: "Add";
	value: unknown;
	key: IDBValidKey;
}

/** @internal */
export interface Get extends Action.Proto {
	_op: "Get";
	key: string;
}

/** @internal */
export interface Delete extends Action.Proto {
	_op: "Delete";
	key: IDBValidKey;
}

/**
 * A Database Action
 *
 * @since 1.0.0
 */
export type Action = Add | Get | Delete;

/**
 * @since 1.0.0
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#adding_data_to_the_database
 */
export const add =
	(store: string) =>
	(value: unknown, key: IDBValidKey): Effect.Effect<Add> =>
		Effect.succeed({ _tag: "Action", _op: "Add", store, value, key });

const _delete =
	(store: string) =>
	(key: IDBValidKey): Effect.Effect<Delete> =>
		Effect.succeed({ _tag: "Action", _op: "Delete", store, key });

const _get =
	(store: string) =>
	(key: string): Effect.Effect<Get> =>
		Effect.succeed({ _tag: "Action", store, _op: "Get", key });

export {
	/**
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#removing_data_from_the_database
	 * @since 1.0.0
	 */
	_delete as delete,

	/**
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#getting_data_from_the_database
	 * @since 1.0.0
	 */
	_get as get
};

/**
 * @since 1.0.0
 */
export type Return<T> = T extends Action
	? { Add: void; Get: unknown; Delete: void }[T["_op"]]
	: never;

/**
 * @since 1.0.0
 */
export type ReturnMap<T> = T extends Action[]
	? {
			[K in keyof T]: Return<T[K]>;
		}
	: null;

/**
 * @since 1.0.0
 */
export interface Store {
	get: ReturnType<typeof _get>;
	add: ReturnType<typeof add>;
	delete: ReturnType<typeof _delete>;
}

/**
 * @since 1.0.0
 */
export const createStore = (store: string): Store => ({
	add: add(store),
	get: _get(store),
	delete: _delete(store)
});
