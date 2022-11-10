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

// src/utils/money.utils.ts
var money_utils_exports = {};
__export(money_utils_exports, {
  fee2Money: () => fee2Money,
  fee2yuan: () => fee2yuan,
  moneyFormt: () => moneyFormt
});
module.exports = __toCommonJS(money_utils_exports);

// src/utils/type.utils.ts
var isNum = function(num) {
  return typeof num === "number" && !isNaN(num);
};

// src/utils/money.utils.ts
var moneyFormt = function(num, decimal = 2) {
  let numbers = "";
  numbers = typeof num === "number" ? num.toFixed(decimal) : Number(num).toFixed(decimal);
  numbers = numbers.indexOf(".") < 0 ? numbers + "." : numbers;
  let newNumber = numbers.replace(/(\d)(?=(\d{3})+\.)/g, "$1,").replace(/\.$/, "");
  return newNumber;
};
var fee2yuan = function(fee, decimal = 2) {
  const totalFee = isNum(fee) ? fee : 0;
  const yuanStr = (totalFee / 100).toFixed(decimal);
  return yuanStr.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
};
var fee2Money = function(fee, decimal = 2) {
  if (isNum(fee)) {
    const yuan = fee / 100;
    const wanUnit = 1e4;
    const baiUnit = 100;
    if (yuan > wanUnit) {
      return (yuan / wanUnit).toFixed(decimal) + "\u4E07";
    } else if (yuan > baiUnit) {
      return Math.floor(yuan);
    } else {
      return yuan.toFixed(decimal);
    }
  } else {
    return "-";
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fee2Money,
  fee2yuan,
  moneyFormt
});
