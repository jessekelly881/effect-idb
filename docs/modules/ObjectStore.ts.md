---
title: ObjectStore.ts
nav_order: 7
parent: Modules
---

## ObjectStore overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Action (type alias)](#action-type-alias)
  - [ObjectStore (interface)](#objectstore-interface)
  - [Return (type alias)](#return-type-alias)
  - [ReturnMap (type alias)](#returnmap-type-alias)
  - [add](#add)
  - [clear](#clear)
  - [count](#count)
  - [delete](#delete)
  - [get](#get)
  - [put](#put)

---

# utils

## Action (type alias)

A Database Action

**Signature**

```ts
export type Action = Add | Get | Delete | Clear | Count | Put
```

Added in v1.0.0

## ObjectStore (interface)

**Signature**

```ts
export interface ObjectStore {
  get: (key: string) => Effect.Effect<Get>
  add: (value: unknown, key: IDBValidKey) => Effect.Effect<Add>
  put: (value: unknown, key: IDBValidKey) => Effect.Effect<Put>
  delete: (key: IDBValidKey) => Effect.Effect<Delete>
  clear: Effect.Effect<Clear>
  count: Effect.Effect<Count>
}
```

Added in v1.0.0

## Return (type alias)

**Signature**

```ts
export type Return<T> = T extends Action
  ? {
      Add: void
      Get: Option.Option<unknown>
      Delete: void
      Clear: void
      Count: number
      Put: void
    }[T["_op"]]
  : never
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

## add

**Signature**

```ts
export declare const add: (store: string) => (value: unknown, key: IDBValidKey) => Effect.Effect<Add>
```

Added in v1.0.0

## clear

**Signature**

```ts
export declare const clear: (store: string) => Effect.Effect<Clear>
```

Added in v1.0.0

## count

**Signature**

```ts
export declare const count: (store: string) => Effect.Effect<Count>
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

## put

**Signature**

```ts
export declare const put: (store: string) => (value: unknown, key: IDBValidKey) => Effect.Effect<Put>
```

Added in v1.0.0
