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
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.open = void 0;
const Error = /*#__PURE__*/__importStar( /*#__PURE__*/require("@/Error"));
const transaction_1 = /*#__PURE__*/require("@/internal/transaction");
const effect_1 = /*#__PURE__*/require("effect");
const update = db => ({
  createObjectStore: name => effect_1.Effect.try({
    try: () => db.createObjectStore(name),
    catch: () => new Error.IndexedDBError({
      message: "Error creating object store"
    })
  })
});
const open = ({
  name,
  onUpgrade,
  version
}) => effect_1.Effect.gen(function* (_) {
  const scope = yield* _(effect_1.Scope.Scope);
  const db = yield* _(effect_1.Effect.async(resume => {
    const openRequest = indexedDB.open(name, version);
    openRequest.onerror = () => {
      resume(new Error.IndexedDBError({
        message: "Failed to open"
      }));
    };
    openRequest.onblocked = () => {
      resume(new Error.IndexedDBError({
        message: "Blocked"
      }));
    };
    openRequest.onsuccess = () => {
      resume(effect_1.Effect.succeed(openRequest.result));
    };
    if (onUpgrade) {
      openRequest.onupgradeneeded = () => __awaiter(this, void 0, void 0, function* () {
        return yield effect_1.Effect.runPromise(onUpgrade(update(openRequest.result)));
      });
    }
  }));
  yield* _(effect_1.Scope.addFinalizer(scope, effect_1.Effect.sync(() => db.close())));
  return {
    transaction: (0, transaction_1.transaction)(db)
  };
});
exports.open = open;
//# sourceMappingURL=open.js.map