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

// src/utils/validate.ts
var validate_exports = {};
__export(validate_exports, {
  validateEmail: () => validateEmail,
  validateForm: () => validateForm,
  validateGtZero: () => validateGtZero,
  validateGteZero: () => validateGteZero,
  validatePhone: () => validatePhone,
  validateRequired: () => validateRequired
});
module.exports = __toCommonJS(validate_exports);

// src/utils/type.utils.ts
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
var isObj = function(obj) {
  return typeof obj === "object" && obj !== null;
};
var isStr = function(str) {
  return typeof str === "string" && trim(str) !== "";
};
var isNum = function(num) {
  return typeof num === "number" && !isNaN(num);
};
var isFunc = function(func) {
  return func && typeof func === "function";
};
var isArr = function(arr) {
  return Array.isArray(arr);
};

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
var judgeFormat = function(str, re) {
  if (isStr(str)) {
    if (re && isFunc(re.test)) {
      return re.test(trim(str));
    } else {
      console.error("\u65E0\u6CD5\u6821\u9A8C\u683C\u5F0F=>", re, str);
      throw new Error("\u6B63\u5219\u9519\u8BEF\uFF0C\u65E0\u6CD5\u6821\u9A8C\u683C\u5F0F");
    }
  } else {
    return false;
  }
};
var isEmail = function(str) {
  return judgeFormat(str, /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/);
};
var isPhone = function(str) {
  return judgeFormat(str, /^[1][3,4,5,7,8,9][0-9]{9}$/);
};

// src/utils/validate.ts
var validateForm = function(columns, formData) {
  if (isArr(columns)) {
    const data = isObj(formData) ? formData : {};
    const errDict = {};
    columns.forEach((it) => {
      const column = it.column;
      const validates = Array.isArray(it.validate) ? it.validate : it.validate ? [it.validate] : [];
      for (const validate of validates) {
        if (isFunc(validate)) {
          const res = validate(data[column], data, it);
          if (isStr(res)) {
            errDict[column] = res;
            break;
          }
        }
      }
    });
    return errDict;
  } else {
    throw new Error("\u5B57\u6BB5\u6570\u636E\u4E3A\u7A7A");
  }
};
var validateRequired = function(val, row, column) {
  if (!isUndefined(val) && val != null && isStr(val + "")) {
    return null;
  } else {
    return `${column.title}\u662F\u5FC5\u586B\u9879`;
  }
};
var validateGtZero = function(val, row, column) {
  if (!isUndefined(val) && val != null && isStr(val + "")) {
    const newVal = Number(val);
    if (isNum(newVal) && newVal > 0) {
      return null;
    } else {
      return `${column.title}\u662F\u5FC5\u987B\u5927\u4E8E0`;
    }
  } else {
    return `${column.title}\u662F\u5FC5\u586B\u9879`;
  }
};
var validateGteZero = function(val, row, column) {
  if (!isUndefined(val) && val != null && isStr(val + "")) {
    const newVal = Number(val);
    if (isNum(newVal) && newVal >= 0) {
      return null;
    } else {
      return `${column.title}\u662F\u5FC5\u987B\u5927\u4E8E\u7B49\u4E8E0`;
    }
  } else {
    return `${column.title}\u662F\u5FC5\u586B\u9879`;
  }
};
var validatePhone = function(val, row, column) {
  if (isPhone(val)) {
    return null;
  } else {
    return `\u624B\u673A\u53F7\u683C\u5F0F\u4E0D\u6B63\u786E`;
  }
};
var validateEmail = function(val, row, column) {
  if (isEmail(val)) {
    return null;
  } else {
    return `\u90AE\u7BB1\u683C\u5F0F\u4E0D\u6B63\u786E`;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  validateEmail,
  validateForm,
  validateGtZero,
  validateGteZero,
  validatePhone,
  validateRequired
});
