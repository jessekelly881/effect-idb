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
  - [make](#make)

---

# utils

## make

**Signature**

```ts
export declare const make: (t: IDBTransaction) => {
  objectStoreNames: DOMStringList
  durability: IDBTransactionDurability
  objectStore: (name: string) => IDBObjectStore
}
```

Added in v1.0.0
