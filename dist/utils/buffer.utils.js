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

// src/utils/buffer.utils.ts
var buffer_utils_exports = {};
__export(buffer_utils_exports, {
  ab2hex: () => ab2hex,
  str2ArrayBuffer: () => str2ArrayBuffer
});
module.exports = __toCommonJS(buffer_utils_exports);

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

// src/utils/buffer.utils.ts
var str2ArrayBuffer = function(str) {
  var array = new Uint8Array(isStr(str) ? str.length : 0);
  for (var i = 0; i < str.length; i++) {
    array[i] = str.charCodeAt(i);
  }
  return array.buffer;
};
var ab2hex = function(buffer) {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function(bit) {
      return ("00" + bit.toString(16)).slice(-2);
    }
  );
  return hexArr.join("");
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ab2hex,
  str2ArrayBuffer
});
