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
  - [layer](#layer)

---

# models

## Database (interface)

**Signature**

```ts
export interface Database {
  /**
   * Database name
   *
   * @since 1.0.0
   */
  name: string

  /**
   * Database version
   *
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
   * Creates a transaction context.
   *
   * @since 1.0.0
   */
  transaction: (
    mode: IDBTransactionMode,
    storeNames: string[]
  ) => Effect.Effect<Transaction.Transaction, Error.IndexedDBError>
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

## layer

Creates an IndexedDB layer from a given IDBFactory

**Signature**

```ts
export declare const layer: (factory: IDBFactory) => Layer.Layer<IndexedDB, never, never>
```

Added in v1.0.0
