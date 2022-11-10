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

// src/utils/type.utils.ts
var type_utils_exports = {};
__export(type_utils_exports, {
  createArr: () => createArr,
  getLen: () => getLen,
  isArr: () => isArr,
  isBool: () => isBool,
  isFunc: () => isFunc,
  isFunction: () => isFunction,
  isNum: () => isNum,
  isNumStr: () => isNumStr,
  isObj: () => isObj,
  isStr: () => isStr,
  isUndefined: () => isUndefined,
  isUndefinedOrNull: () => isUndefinedOrNull
});
module.exports = __toCommonJS(type_utils_exports);

// src/utils/string.utils.ts
var trim = function(str, patternStr = "\\s", replaceStr = "") {
  if (typeof str === "string") {
    patternStr.replace(/\s+/, "") === "" && (patternStr = "\\s");
    let re = new RegExp(`^(${patternStr})*(.*?)(${patternStr})*$`);
    return str.replace(re, function(_, one, two, three) {
      let returnStr = "";
      if (patternStr === one) {
        returnStr += replaceStr;
      }
      returnStr += two;
      if (patternStr === three) {
        returnStr += replaceStr;
      }
      return returnStr;
    });
  } else {
    return str;
  }
};

// src/utils/type.utils.ts
var isFunction = function(func) {
  return typeof func === "function";
};
var isUndefined = function(...args) {
  if (Array.isArray(args) && args.length > 0) {
    let uNum = 0;
    for (var i = 0; i < args.length; i++) {
      let it = args[i];
      if (typeof it === "undefined") {
        uNum++;
      } else {
        return false;
      }
    }
    return uNum === args.length;
  } else {
    return true;
  }
};
var isUndefinedOrNull = function(...args) {
  if (Array.isArray(args) && args.length > 0) {
    let uNum = 0;
    for (var i = 0; i < args.length; i++) {
      let it = args[i];
      if (typeof it === "undefined" || it === null) {
        uNum++;
      } else {
        return false;
      }
    }
    return uNum === args.length;
  } else {
    return true;
  }
};
var isObj = function(obj) {
  return typeof obj === "object" && obj !== null;
};
var isStr = function(str) {
  return typeof str === "string" && trim(str) !== "";
};
var isNum = function(num) {
  return typeof num === "number" && !isNaN(num);
};
var isNumStr = function(num) {
  return /^[\d\.]+$/.test(num + "");
};
var isFunc = function(func) {
  return func && typeof func === "function";
};
var isArr = function(arr) {
  return Array.isArray(arr);
};
var isBool = function(bool) {
  return typeof bool === "boolean";
};
var createArr = function(start, end, type = "add") {
  var arr = Array.from(new Array(end + 1).keys()).slice(start);
  return type === "add" ? arr : arr.reverse();
};
var getLen = function(data) {
  if (Array.isArray(data)) {
    return data.length;
  } else if (isStr(data)) {
    return data.length;
  } else if (isNum(data)) {
    const temp = parseInt(data);
    return isNaN(temp) ? 0 : (temp + "").length;
  } else {
    debugger;
    throw new Error("\u83B7\u53D6\u957F\u5EA6\u5931\u8D25");
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createArr,
  getLen,
  isArr,
  isBool,
  isFunc,
  isFunction,
  isNum,
  isNumStr,
  isObj,
  isStr,
  isUndefined,
  isUndefinedOrNull
});
