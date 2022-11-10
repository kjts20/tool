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

// src/utils/math.utils.ts
var math_utils_exports = {};
__export(math_utils_exports, {
  arrAverage: () => arrAverage,
  arrSum: () => arrSum
});
module.exports = __toCommonJS(math_utils_exports);
var arrSum = function(arr, itemCb) {
  let sum = 0;
  if (!Array.isArray(arr)) {
    arr = [arr];
  }
  const itemDeal = typeof itemCb === "function" ? itemCb : Number;
  for (const it of arr) {
    let val = itemDeal(it);
    if (!isNaN(val)) {
      sum += val;
    }
  }
  return sum;
};
var arrAverage = function(arr) {
  const sum = arrSum(arr);
  if (Array.isArray(arr)) {
    return sum / arr.length;
  } else {
    return sum;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  arrAverage,
  arrSum
});
