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

// src/utils/number.utils.ts
var number_utils_exports = {};
__export(number_utils_exports, {
  overTenThousand: () => overTenThousand
});
module.exports = __toCommonJS(number_utils_exports);
var overTenThousand = function(num) {
  var newNum = parseInt(num);
  if (isNaN(newNum)) {
    return 0;
  } else {
    const len = (newNum + "").length;
    if (len > 8) {
      return (newNum / 1e4 / 1e4).toFixed(2) + "\u4EBF";
    } else if (len > 4) {
      return (newNum / 1e4).toFixed(2) + "\u4E07";
    } else {
      return newNum;
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  overTenThousand
});
