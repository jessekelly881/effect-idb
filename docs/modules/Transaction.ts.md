---
title: Transaction.ts
nav_order: 8
parent: Modules
---

## Transaction overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Transaction (interface)](#transaction-interface)
  - [make](#make)
  - [transaction](#transaction)

---

# utils

## Transaction (interface)

**Signature**

```ts
export interface Transaction {
  objectStoreNames: DOMStringList
  durability: IDBTransactionDurability
  objectStore: (name: string) => ObjectStore.ObjectStore
}
```

Added in v1.0.0

## make

**Signature**

```ts
export declare const make: (t: IDBTransaction) => Transaction
```

Added in v1.0.0

## transaction

**Signature**

```ts
export declare const transaction: (
  idb: IDBDatabase
) => (mode: IDBTransactionMode, storeNames: string[]) => Effect.Effect<Transaction, IndexedDBError, never>
```

Added in v1.0.0
