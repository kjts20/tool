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

// src/utils/url.utils.ts
var url_utils_exports = {};
__export(url_utils_exports, {
  mergeUrl: () => mergeUrl,
  obj2RequestUrl: () => obj2RequestUrl,
  requestStr2Obj: () => requestStr2Obj,
  urlDecode: () => urlDecode,
  urlEncode: () => urlEncode
});
module.exports = __toCommonJS(url_utils_exports);

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

// src/utils/url.utils.ts
var requestStr2Obj = function(requestUrl, valAutoDecode = true) {
  requestUrl = requestUrl.replace(/^.*?\?(.*?)$/, "$1");
  var requestArr = requestUrl.split("&");
  var valueRe = /^([a-zA-Z0-9\_\_]+)=(.*?)$/;
  var paramsObj = {};
  const val2Real = (val) => {
    let intRe = /^\d+$/, floatRe = /^\d*\.\d*$/, trueRe = /^true$/i, falseRe = /^false$/i;
    if (falseRe.test(val)) {
      return false;
    } else if (trueRe.test(val)) {
      return true;
    } else if (floatRe.test(val)) {
      return parseFloat(val);
    } else if (intRe.test(val)) {
      return parseInt(val);
    } else {
      return val;
    }
  };
  for (var i = 0, it; i < requestArr.length; i++) {
    it = requestArr[i];
    if (valueRe.test(it)) {
      const key = it.replace(valueRe, "$1");
      const val = it.replace(valueRe, "$2");
      paramsObj[urlDecode(key)] = val2Real(valAutoDecode ? urlDecode(val) : val);
    }
  }
  return paramsObj;
};
var urlEncode = function(str) {
  const strEncode = function(encodeStr) {
    if (isStr(encodeStr) && urlDecode(encodeStr) !== encodeStr) {
      return encodeStr;
    } else {
      return encodeURIComponent(encodeStr);
    }
  };
  try {
    const json = JSON.parse(str);
    if (json === void 0) {
      return strEncode;
    } else {
      return encodeURIComponent(str);
    }
  } catch (e) {
    return encodeURIComponent(str);
  }
};
var urlDecode = function(str) {
  if (isStr(str)) {
    try {
      return decodeURIComponent(str);
    } catch (e) {
      return str;
    }
  } else {
    return str;
  }
};
var obj2RequestUrl = function(obj) {
  if (typeof obj === "object" && obj !== null) {
    var newObj = JSON.parse(JSON.stringify(obj));
    var tempRequestArr = [];
    for (var i in newObj) {
      var val = newObj[i];
      if (typeof i !== "string" || i === "") {
        continue;
      } else {
        var key = i;
        var attrStr = "";
        if (Array.isArray(val)) {
          if (!/\[\]$/.test(key)) {
            key += "[]";
          }
          var valAttr = [];
          for (var i in val) {
            if (typeof val[i] === "object") {
              console.error("\u53EA\u662F\u652F\u6301\u4E00\u7EA7\u6570\u7EC4\uFF01\uFF01\uFF01");
              continue;
            } else {
              valAttr.push(key + "=" + urlEncode(val[i]));
            }
          }
          attrStr = valAttr.join("&");
        } else if (typeof val === "object") {
          attrStr = key + "=" + urlEncode(JSON.stringify(val));
        } else {
          attrStr = key + "=" + urlEncode(val);
        }
        tempRequestArr.push(attrStr);
      }
    }
    return tempRequestArr.join("&");
  } else {
    console.error("\u65E0\u6CD5\u8F6C\u6362\uFF0C\u4F7F\u7528Object\u4E0D\u5408\u6CD5\uFF01\uFF01\uFF01", obj);
    return "";
  }
};
var mergeUrl = function(mainUrl, ...param) {
  if (typeof mainUrl !== "string") {
    throw new Error("main url main be a string!");
  } else {
    let allRequest = {};
    for (var i = 0; i < param.length; i++) {
      var item = param[i];
      if (typeof item === "object") {
        Object.assign(allRequest, item);
      } else if (typeof item === "string") {
        Object.assign(allRequest, requestStr2Obj(item));
      }
    }
    const urlParts = mainUrl.split("?");
    let hash = "";
    if (urlParts.length === 2) {
      const hashParts = urlParts[1].split("#");
      Object.assign(allRequest, requestStr2Obj(urlParts[1]));
      if (hashParts.length > 1) {
        hash = "#" + hashParts[1];
      }
    }
    const searchUrl = Object.keys(allRequest).length > 0 ? `?${obj2RequestUrl(allRequest)}` : "";
    return `${urlParts[0]}${searchUrl}${hash}`;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mergeUrl,
  obj2RequestUrl,
  requestStr2Obj,
  urlDecode,
  urlEncode
});
