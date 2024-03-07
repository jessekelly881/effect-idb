/**
 * @since 1.0.0
 */

import { Effect, Option } from "effect";

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

/** @internal */
export interface Clear extends Action.Proto {
	_op: "Clear";
}

/** @internal */
export interface Count extends Action.Proto {
	_op: "Count";
}

/**
 * A Database Action
 *
 * @since 1.0.0
 */
export type Action = Add | Get | Delete | Clear | Count;

/**
 * @since 1.0.0
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#adding_data_to_the_database
 */
export const add =
	(store: string) =>
	(value: unknown, key: IDBValidKey): Effect.Effect<Add> =>
		Effect.succeed({ _tag: "Action", _op: "Add", store, value, key });

/**
 * @since 1.0.0
 */
export const clear = (store: string) => (): Effect.Effect<Clear> =>
	Effect.succeed({ _tag: "Action", _op: "Clear", store });

/**
 * @since 1.0.0
 */
export const count = (store: string) => (): Effect.Effect<Count> =>
	Effect.succeed({ _tag: "Action", _op: "Count", store });

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
	? {
			Add: void;
			Get: Option.Option<unknown>;
			Delete: void;
			Clear: void;
			Count: number;
		}[T["_op"]]
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
	get: (key: string) => Effect.Effect<Get>;
	add: (value: unknown, key: IDBValidKey) => Effect.Effect<Add>;
	delete: (key: IDBValidKey) => Effect.Effect<Delete>;
	clear: () => Effect.Effect<Clear>;
	count: () => Effect.Effect<Count>;
}
