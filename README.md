# effect-idb
[![Check](https://github.com/jessekelly881/effect-idb/actions/workflows/check.yml/badge.svg)](https://github.com/jessekelly881/effect-idb/actions/workflows/check.yml)
[![Npm package monthly downloads](https://badgen.net/npm/dm/effect-schema-compilers)](https://npmjs.com/package/effect-idb)

An IndexedDB wrapper for Effect.

## Layers

IndexedDB Layers are created by passing in an instance of IDBFactory which can either be a test factory from fake-indexeddb or the browser root indexedDB object.

**Browser**

```ts
import { IndexedDB } from "effect-idb";
const layerBrowser = IndexedDB.layer(indexedDB); // uses global indexedDB instance
```

**Memory/Test**

```ts
import { IndexedDB } from "effect-idb";
import { indexedDB } from "fake-indexeddb";

const layerFake = IndexedDB.layer(indexedDB);
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
 Effect.provide(IndexedDB.layer(indexedDB)),
 Effect.scoped,
 Effect.runFork
);
```

## KeyValueStore

effect-idb exports an instance of @effect/platform/KeyValueStore for easily reading and writing values to a managed IndexedDB database.

```ts
import * as KeyValueStore from "@effect/platform/KeyValueStore";
import { layer } from "effect-idb/KeyValueStore";

Effect.gen(function* (_) {
  const kv = yield* _(KeyValueStore.KeyValueStore);
  yield* _(kv.set("/foo/bar", "bar"));
}).pipe(Effect.provide(layer("database", "store")))
```
