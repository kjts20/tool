var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/function.utils.ts
var function_utils_exports = {};
__export(function_utils_exports, {
  toFunction: () => toFunction
});
module.exports = __toCommonJS(function_utils_exports);
var toFunction = (val) => {
  if (typeof val === "string" && val !== "") {
    try {
      return new Function("return " + val)();
    } catch (err) {
      console.error("\u65E0\u6CD5\u628A\u5B57\u7B26\u4E32\u8F6C\u6362\u4E3A\u51FD\u6570", err);
      return void 0;
    }
  } else {
    return void 0;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  toFunction
});
