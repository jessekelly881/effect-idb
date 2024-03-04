"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.layer = exports.IndexedDB = void 0;
const open_1 = /*#__PURE__*/require("@/internal/open");
const effect_1 = /*#__PURE__*/require("effect");
class IndexedDB extends effect_1.Context.Tag("IndexedDB")() {}
exports.IndexedDB = IndexedDB;
exports.layer = /*#__PURE__*/effect_1.Layer.succeed(IndexedDB, /*#__PURE__*/IndexedDB.of({
  open: open_1.open
}));
//# sourceMappingURL=IndexedDB.js.map