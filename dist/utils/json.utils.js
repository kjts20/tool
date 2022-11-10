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

// src/utils/json.utils.ts
var json_utils_exports = {};
__export(json_utils_exports, {
  deepCopy: () => deepCopy,
  jsonParse: () => jsonParse
});
module.exports = __toCommonJS(json_utils_exports);

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
var isStr = function(str) {
  return typeof str === "string" && trim(str) !== "";
};

// src/utils/json.utils.ts
var deepCopy = function(obj) {
  if (obj) {
    return JSON.parse(JSON.stringify(obj));
  } else {
    return obj;
  }
};
var jsonParse = function(josnStr) {
  if (isStr(josnStr)) {
    try {
      return JSON.parse(josnStr);
    } catch (e) {
      return null;
    }
  } else {
    return null;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deepCopy,
  jsonParse
});
