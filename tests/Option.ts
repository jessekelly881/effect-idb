/**
 *
 * @since 1.0.0
 */
import { Option } from "effect";
import { expect } from "vitest";

export const formatUnknown = (val: unknown) =>
	typeof val === "string" ? `"${val}"` : `${val}`;

/** @internal */
const expectedOption = (val: unknown) => ({
	message: () => `expected ${val} to be an Option`,
	pass: false
});

/** @internal */
const expectedNone = (val: unknown) => ({
	message: () => `expected ${val} to be None`,
	pass: false
});

/** @internal */
const expectedSome = (val: unknown) => ({
	message: () => `expected ${val} to be Some`,
	pass: false
});

expect.extend({
	toBeNone: <T>(received: Option.Option<T>) => {
		if (!Option.isOption(received)) {
			return expectedOption(received);
		}

		if (!Option.isNone(received)) {
			return expectedNone(received);
		}

		return {
			message: () => `${received} is None`,
			pass: true
		};
	},

	toBeSome: <T>(received: Option.Option<T>, expected?: T) => {
		if (!Option.isOption(received)) {
			return expectedOption(received);
		}

		if (!Option.isSome(received)) {
			return expectedSome(received);
		}

		if (expected) {
			return {
				message: () =>
					`expected Some(${formatUnknown(
						received.value
					)}) to equal Some(${formatUnknown(expected)})`,
				pass: received.value === expected,
				actual: received.value,
				expected
			};
		}

		return {
			message: () => ``,
			pass: true
		};
	}
});

type OptionType<T> = T extends Option.Option<infer A> ? A : never;

interface OptionMatchers<R = unknown> {
	/**
	 * Test that the value is equal to `Option.None`
	 * @since 1.0.0
	 */
	toBeNone: () => void;

	/**
	 * Test that the value is equal to `Option.Some(?)`
	 * @since 1.0.0
	 */
	toBeSome: (val?: OptionType<R>) => void;
}

declare module "vitest" {
	interface Assertion<T> extends OptionMatchers<T> {}
	interface AsymmetricMatchersContaining extends OptionMatchers {}
}
