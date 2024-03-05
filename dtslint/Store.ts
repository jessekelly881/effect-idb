import { Add, Get, ReturnMap } from "../src/Store";

// $ExpectType [void, unknown, void]
export type Ret = ReturnMap<[Add, Get, Add]>;
