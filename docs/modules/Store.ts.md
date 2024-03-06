---
title: Store.ts
nav_order: 6
parent: Modules
---

## Store overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Action (type alias)](#action-type-alias)
  - [Return (type alias)](#return-type-alias)
  - [ReturnMap (type alias)](#returnmap-type-alias)
  - [Store (interface)](#store-interface)
  - [add](#add)
  - [createStore](#createstore)
  - [delete](#delete)
  - [get](#get)

---

# utils

## Action (type alias)

A Database Action

**Signature**

```ts
export type Action = Add | Get | Delete
```

Added in v1.0.0

## Return (type alias)

**Signature**

```ts
export type Return<T> = T extends Action ? { Add: void; Get: Option.Option<unknown>; Delete: void }[T["_op"]] : never
```

Added in v1.0.0

## ReturnMap (type alias)

**Signature**

```ts
export type ReturnMap<T> = T extends Action[]
  ? {
      [K in keyof T]: Return<T[K]>
    }
  : null
```

Added in v1.0.0

## Store (interface)

**Signature**

```ts
export interface Store {
  get: (key: string) => Effect.Effect<Get>
  add: (value: unknown, key: IDBValidKey) => Effect.Effect<Add>
  delete: (key: IDBValidKey) => Effect.Effect<Delete>
}
```

Added in v1.0.0

## add

**Signature**

```ts
export declare const add: (store: string) => (value: unknown, key: IDBValidKey) => Effect.Effect<Add>
```

Added in v1.0.0

## createStore

**Signature**

```ts
export declare const createStore: (store: string) => Store
```

Added in v1.0.0

## delete

**Signature**

```ts
export declare const delete: (store: string) => (key: IDBValidKey) => Effect.Effect<Delete, never, never>
```

Added in v1.0.0

## get

**Signature**

```ts
export declare const get: (store: string) => (key: string) => Effect.Effect<Get, never, never>
```

Added in v1.0.0
