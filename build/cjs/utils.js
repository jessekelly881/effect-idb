"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapRequest = void 0;
const effect_1 = /*#__PURE__*/require("effect");
const wrapRequest = (request, onError) => effect_1.Effect.async(resume => {
  const r = request();
  r.onsuccess = () => {
    resume(effect_1.Effect.succeed(r.result));
  };
  r.onerror = () => {
    resume(effect_1.Effect.fail(onError(r.error)));
  };
});
exports.wrapRequest = wrapRequest;
//# sourceMappingURL=utils.js.map