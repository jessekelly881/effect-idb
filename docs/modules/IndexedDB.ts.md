---
title: IndexedDB.ts
nav_order: 3
parent: Modules
---

## IndexedDB overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [layers](#layers)
  - [layer](#layer)
- [models](#models)
  - [Database (interface)](#database-interface)
  - [IndexedDB (class)](#indexeddb-class)
  - [Update (interface)](#update-interface)

---

# layers

## layer

**Signature**

```ts
export declare const layer: Layer.Layer<IndexedDB, never, never>
```

Added in v1.0.0

# models

## Database (interface)

**Signature**

```ts
export interface Database {
  /**
   * @since 1.0.0
   */
  transaction: <I, R, Stores extends string[], Actions extends Store.Action[]>(
    stores: Stores,
    program: (_: Record<Stores[number], Store.Store>) => Effect.Effect<Actions, I, R>
  ) => Effect.Effect<Store.ReturnMap<Actions>, I | Error.IndexedDBError, R>
}
```

Added in v1.0.0

## IndexedDB (class)

Top level IndexedDB layer

**Signature**

```ts
export declare class IndexedDB
```

Added in v1.0.0

## Update (interface)

**Signature**

```ts
export interface Update {
  /**
   * @since 1.0.0
   */
  createObjectStore: (name: string) => Effect.Effect<IDBObjectStore, Error.IndexedDBError>
}
```

Added in v1.0.0
