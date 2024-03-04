"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = exports.get = exports.delete = exports.add = void 0;
const effect_1 = /*#__PURE__*/require("effect");
const add = store => (value, key) => effect_1.Effect.succeed({
  _tag: "Action",
  _op: "Add",
  store,
  value,
  key
});
exports.add = add;
const _delete = store => key => effect_1.Effect.succeed({
  _tag: "Action",
  _op: "Delete",
  store,
  key
});
exports.delete = _delete;
const _get = store => key => effect_1.Effect.succeed({
  _tag: "Action",
  store,
  _op: "Get",
  key
});
exports.get = _get;
const createStore = store => ({
  add: (0, exports.add)(store),
  get: _get(store),
  delete: _delete(store)
});
exports.createStore = createStore;
//# sourceMappingURL=Store.js.map