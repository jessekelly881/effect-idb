declare const IndexedDBError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "IndexedDBError";
} & Readonly<A>;
export declare class IndexedDBError extends IndexedDBError_base<{
    message: string;
}> {
}
export {};
//# sourceMappingURL=Error.d.ts.map