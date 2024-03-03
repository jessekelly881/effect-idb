/**
 * @since 1.0.0
 */
import { Data } from "effect";

export class IndexedDBError extends Data.TaggedError("IndexedDBError")<{
	message: string;
}> {}
