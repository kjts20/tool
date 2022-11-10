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

// src/utils/filter.utils.ts
var filter_utils_exports = {};
__export(filter_utils_exports, {
  toBool: () => toBool
});
module.exports = __toCommonJS(filter_utils_exports);
var toBool = function(data) {
  switch (typeof data) {
    case "boolean":
      return data;
    case "string": {
      if (data === "" || data === "0") {
        return false;
      } else {
        return true;
      }
    }
    case "number":
    case "object":
    default:
      return data ? true : false;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  toBool
});
