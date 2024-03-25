---
title: utils.ts
nav_order: 9
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
export declare const wrapRequest: <T, A, E, R>(
  request: () => IDBRequest<T>,
  onError: (err: DOMException | null) => Effect.Effect<A, E, R>
) => Effect.Effect<T | A, E, R>
```

Added in v1.0.0
