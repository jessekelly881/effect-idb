"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function () {
        return m[k];
      }
    };
  }
  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});
var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transaction = void 0;
const Error = /*#__PURE__*/__importStar( /*#__PURE__*/require("@/Error"));
const Store = /*#__PURE__*/__importStar( /*#__PURE__*/require("@/Store"));
const utils_1 = /*#__PURE__*/require("@/utils");
const effect_1 = /*#__PURE__*/require("effect");
const transaction = idb => (stores, program) => effect_1.Effect.gen(function* (_) {
  const actions = yield* _(program(effect_1.ReadonlyRecord.fromIterableWith(stores, store => [store, Store.createStore(store)])));
  const t = yield* _(effect_1.Effect.try({
    try: () => idb.transaction(stores, "readwrite"),
    catch: () => new Error.IndexedDBError({
      message: ""
    })
  }));
  const storeHandles = effect_1.ReadonlyRecord.fromIterableWith(stores, store => [store, t.objectStore(store)]);
  const ret = yield* _(effect_1.Effect.all(actions.map(action => {
    const store = storeHandles[action.store];
    switch (action._op) {
      case "Add":
        {
          return (0, utils_1.wrapRequest)(() => store.add(action.value, action.key), () => new Error.IndexedDBError({
            message: "Error adding value to store"
          }));
        }
      case "Get":
        {
          return (0, utils_1.wrapRequest)(() => store.get(action.key), () => new Error.IndexedDBError({
            message: "Error getting value from store"
          }));
        }
      case "Delete":
        {
          return (0, utils_1.wrapRequest)(() => store.delete(action.key), () => new Error.IndexedDBError({
            message: "Error getting value from store"
          }));
        }
    }
  })));
  return ret;
});
exports.transaction = transaction;
//# sourceMappingURL=transaction.js.map