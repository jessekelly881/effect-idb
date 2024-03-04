import { Effect } from "effect";
export declare namespace Action {
    interface Proto {
        _tag: "Action";
        store: string;
    }
}
export interface Add extends Action.Proto {
    _op: "Add";
    value: unknown;
    key: IDBValidKey;
}
export interface Get extends Action.Proto {
    _op: "Get";
    key: string;
}
export interface Delete extends Action.Proto {
    _op: "Delete";
    key: IDBValidKey;
}
export type Action = Add | Get | Delete;
export declare const add: (store: string) => (value: unknown, key: IDBValidKey) => Effect.Effect<Add>;
declare const _delete: (store: string) => (key: IDBValidKey) => Effect.Effect<Delete>;
declare const _get: (store: string) => (key: string) => Effect.Effect<Get>;
export { _delete as delete, _get as get };
export type Return<T> = T extends Action ? {
    Add: void;
    Get: unknown;
    Delete: void;
}[T["_op"]] : never;
export type ReturnMap<T> = T extends Action[] ? {
    [K in keyof T]: Return<T[K]>;
} : null;
export interface Store {
    get: ReturnType<typeof _get>;
    add: ReturnType<typeof add>;
    delete: ReturnType<typeof _delete>;
}
export declare const createStore: (store: string) => Store;
//# sourceMappingURL=Store.d.ts.map