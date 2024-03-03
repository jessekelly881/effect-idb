# effect-idb

An IndexedDB wrapper for Effect.

```ts
import * as IndexedDB from "effect-idb";

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
 Effect.provide(layer),
 Effect.scoped,
 Effect.runFork
);
```
