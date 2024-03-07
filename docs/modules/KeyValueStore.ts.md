---
title: KeyValueStore.ts
nav_order: 6
parent: Modules
---

## KeyValueStore overview

A key-value store built ontop of a managed IndexedDB database.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [layer](#layer)

---

# utils

## layer

Create a key-value store layer.

**Signature**

```ts
export declare const layer: (
  dbName: string,
  storeName: string
) => Layer.Layer<KeyValueStore.KeyValueStore, Error.IndexedDBError, IndexedDB.IndexedDB>
```

Added in v1.0.0
