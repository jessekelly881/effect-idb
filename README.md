# effect-idb

An IndexedDB wrapper for Effect.

## Layers

IndexedDB Layers are created by passing in an instance of IDBFactory which can either be a test factory from fake-indexeddb or the browser root indexedDB object.

### Browser

```ts
import { IndexedDB } from "effect-idb";
const layerBrowser = IndexedDB.createLayer(indexedDB); // uses global indexedDB instance
```

### Memory/Test

```ts
import { IndexedDB } from "effect-idb";
import { indexedDB } from "fake-indexeddb";

const layerFake = IndexedDB.createLayer(indexedDB);
```

## Transactions

```ts
import { IndexedDB } from "effect-idb";
import { Effect } from "effect";

Effect.gen(function* (_) {
 const idb = yield* _(IndexedDB.IndexedDB);
 const db = yield* _(
  idb.open({
   name: "store21",
   version: 2,
   onUpgrade: (db) =>
    Effect.gen(function* (_) {
     yield* _(db.createObjectStore("store").pipe(Effect.orDie));
    })
  })
 );
 yield* _(
  db.transaction(["store"], ({ store }) =>
   Effect.all([store.add({ a: 1 }, "a")])
  )
 );
}).pipe(
 Effect.provide(IndexedDB.createLayer(indexedDB)),
 Effect.scoped,
 Effect.runFork
);
```
