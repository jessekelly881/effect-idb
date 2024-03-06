---
title: IndexedDB.ts
nav_order: 3
parent: Modules
---

## IndexedDB overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [models](#models)
  - [Database (interface)](#database-interface)
  - [IndexedDB (class)](#indexeddb-class)
  - [Update (interface)](#update-interface)
- [utils](#utils)
  - [createLayer](#createlayer)

---

# models

## Database (interface)

**Signature**

```ts
export interface Database {
  /**
   * Database name
   * @since 1.0.0
   */
  name: string

  /**
   * Database version
   * @since 1.0.0
   */
  version: number

  /**
   * List of store names
   *
   * @since 1.0.0
   */
  objectStoreNames: DOMStringList

  /**
   * @since 1.0.0
   */
  transaction: <I, R, const Stores extends string[], Actions extends Store.Action[]>(
    stores: Stores,
    program: (_: Record<Stores[number], Store.Store>) => Effect.Effect<Actions, I, R>
  ) => Effect.Effect<Store.ReturnMap<Actions>, I | Error.IndexedDBError, R | Scope.Scope>
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

Database object w/ extended update capabilities only available during upgrade event.

**Signature**

```ts
export interface Update extends Database {
  /**
   * @since 1.0.0
   */
  createObjectStore: (name: string) => Effect.Effect<IDBObjectStore, Error.IndexedDBError>

  /**
   * @since 1.0.0
   */
  deleteObjectStore: (name: string) => Effect.Effect<void, Error.IndexedDBError>
}
```

Added in v1.0.0

# utils

## createLayer

Creates an IndexedDB layer from a given IDBFactory

**Signature**

```ts
export declare const createLayer: (factory: IDBFactory) => Layer.Layer<IndexedDB, never, never>
```

Added in v1.0.0
