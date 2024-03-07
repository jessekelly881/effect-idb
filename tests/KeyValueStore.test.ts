/**
 * @since 1.0.0
 */

import * as KeyValueStore from "@effect/platform/KeyValueStore";
import { Effect } from "effect";
import { describe } from "vitest";
import { layer } from "../src/KeyValueStore";
import "./Option";
import { test } from "./utils";

const testKvLayer = layer("test", "store");

describe("KeyValueStore", () => {
	test("set", (ctx) =>
		Effect.gen(function* (_) {
			const kv = yield* _(KeyValueStore.KeyValueStore);
			yield* _(kv.set("/foo/bar", "bar"));

			const value = yield* _(kv.get("/foo/bar"));
			const length = yield* _(kv.size);

			ctx.expect(value).toBeSome("bar");
			ctx.expect(length).toEqual(1);
		}).pipe(Effect.provide(testKvLayer)));

	test("get <None>", (ctx) =>
		Effect.gen(function* (_) {
			const kv = yield* _(KeyValueStore.KeyValueStore);
			const value = yield* _(kv.get("foo"));

			ctx.expect(value).toBeNone();
		}).pipe(Effect.provide(testKvLayer)));

	test("remove", (ctx) =>
		Effect.gen(function* (_) {
			const kv = yield* _(KeyValueStore.KeyValueStore);
			yield* _(kv.set("foo", "bar"));
			yield* _(kv.remove("foo"));

			const value = yield* _(kv.get("foo"));
			const length = yield* _(kv.size);

			ctx.expect(value).toBeNone();
			ctx.expect(length).toEqual(0);
		}).pipe(Effect.provide(testKvLayer)));

	test("clear", (ctx) =>
		Effect.gen(function* (_) {
			const kv = yield* _(KeyValueStore.KeyValueStore);
			yield* _(kv.set("foo", "bar"));
			yield* _(kv.clear);

			const value = yield* _(kv.get("foo"));
			const length = yield* _(kv.size);

			ctx.expect(value).toBeNone();
			ctx.expect(length).toEqual(0);
		}).pipe(Effect.provide(testKvLayer)));

	test("modify", (ctx) =>
		Effect.gen(function* (_) {
			const kv = yield* _(KeyValueStore.KeyValueStore);
			yield* _(kv.set("foo", "bar"));

			const value = yield* _(kv.modify("foo", (v) => v + "bar"));
			const length = yield* _(kv.size);

			ctx.expect(value).toBeSome("barbar");
			ctx.expect(length).toEqual(1);
		}).pipe(Effect.provide(testKvLayer)));

	test("modify - none", (ctx) =>
		Effect.gen(function* (_) {
			const kv = yield* _(KeyValueStore.KeyValueStore);

			const value = yield* _(kv.modify("foo", (v) => v + "bar"));
			const length = yield* _(kv.size);

			ctx.expect(value).toBeNone();
			ctx.expect(length).toEqual(0);
		}).pipe(Effect.provide(testKvLayer)));
});
