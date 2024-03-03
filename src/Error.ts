/**
 * @since 1.0.0
 */
import { Data } from "effect";

/**
 * @since 1.0.0
 */
export class IndexedDBError extends Data.TaggedError("IndexedDBError")<{
	message: string;
}> {}
