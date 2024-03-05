import { Add, Get, ReturnMap } from "../src/Store";

// $ExpectType [void, Option<unknown>, void]
export type Ret = ReturnMap<[Add, Get, Add]>;
