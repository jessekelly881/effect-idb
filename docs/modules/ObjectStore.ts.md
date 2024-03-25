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
  - [ObjectStore](#objectstore)
  - [ObjectStore (interface)](#objectstore-interface)
  - [make](#make)

---

# utils

## ObjectStore

**Signature**

```ts
export declare const ObjectStore: Context.Tag<ObjectStore, ObjectStore>
```

Added in v1.0.0

## ObjectStore (interface)

**Signature**

```ts
export interface ObjectStore {
  get: (key: IDBValidKey) => Effect.Effect<Option.Option<any>, IndexedDBError>
  clear: Effect.Effect<void, IndexedDBError>
  count: Effect.Effect<number, IndexedDBError>
  put: (value: any, key?: IDBValidKey) => Effect.Effect<IDBValidKey, IndexedDBError>
  add: (value: any, key?: IDBValidKey) => Effect.Effect<IDBValidKey, IndexedDBError>
  delete: (key: IDBValidKey | IDBKeyRange) => Effect.Effect<void, IndexedDBError>
}
```

Added in v1.0.0

## make

**Signature**

```ts
export declare const make: (idbStore: IDBObjectStore) => ObjectStore
```

Added in v1.0.0
