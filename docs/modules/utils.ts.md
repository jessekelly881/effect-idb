---
title: utils.ts
nav_order: 8
parent: Modules
---

## utils overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [wrapRequest](#wraprequest)

---

# utils

## wrapRequest

Convers an IDBRequest into an Effect

**Signature**

```ts
export declare const wrapRequest: <T>(
  request: () => IDBRequest<T>,
  onError: (err: DOMException | null) => Error.IndexedDBError
) => Effect.Effect<T, Error.IndexedDBError, never>
```

Added in v1.0.0
