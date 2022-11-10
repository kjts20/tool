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

// src/utils/style.utils.ts
var style_utils_exports = {};
__export(style_utils_exports, {
  fixContainer: () => fixContainer,
  toStyleObj: () => toStyleObj,
  toStyleStr: () => toStyleStr
});
module.exports = __toCommonJS(style_utils_exports);

// src/utils/string.utils.ts
var camelToKebab = function(camelStr) {
  const isUpper = camelStr[0].charCodeAt(0) >= 65 && camelStr[0].charCodeAt(0) <= 90;
  const handleStr = camelStr.replace(/([A-Z])/g, "-$1").toLowerCase();
  let kebabStr = handleStr;
  if (isUpper) {
    kebabStr = handleStr.slice(1);
  }
  const newKebabArr = [];
  const kebabSplitArr = kebabStr.split("-");
  kebabSplitArr.forEach((item, index) => {
    if (item.length > 1) {
      newKebabArr.push(item);
    } else {
      let combineStr = "";
      const subKebabArr = kebabSplitArr.slice(index);
      for (let i = 0; i < subKebabArr.length; i++) {
        if (subKebabArr[i].length > 1)
          break;
        combineStr += subKebabArr[i];
      }
      newKebabArr.push(combineStr);
      kebabSplitArr.splice(index + 1, combineStr.length - 1);
    }
  });
  return newKebabArr.join("-");
};

// src/utils/style.utils.ts
var _addUnitAttr = ["height", "minHeight", "width", "minWidth", "padding", "paddingTop", "paddingBottom", "paddingLeft", "paddingRight", "margin", "marginTop", "marginBottom", "marginLeft", "marginRight", "top", "left", "right", "bottom"];
var addUnitAttr = [..._addUnitAttr, ..._addUnitAttr.map((it) => camelToKebab(it)).filter((it) => !_addUnitAttr.includes(it))];
var toStyleStr = (styleObj, unit = "rpx") => {
  if (Array.isArray(styleObj)) {
    return styleObj.join(";");
  } else {
    if (typeof styleObj === "object" && styleObj !== null) {
      let style = [];
      for (const k in styleObj) {
        if (typeof k === "string") {
          let val = styleObj[k];
          if (val !== void 0) {
            if (typeof val === "number") {
              if (addUnitAttr.includes(k)) {
                val = val + unit;
              }
            }
            style.push(`${camelToKebab(k)}:${val}`);
          }
        }
      }
      return style.length > 0 ? style.join(";") + ";" : "";
    } else {
      return styleObj;
    }
  }
};
var toStyleObj = (styleStr) => {
  if (typeof styleStr === "string" && styleStr !== "") {
    const styleItemRe = /^\s*(.*?)\s*:\s*(.*?)\s*$/;
    const style = {};
    for (const it of styleStr.split(";")) {
      if (styleItemRe.test(it)) {
        let [_, key, val] = it.match(styleItemRe) || [];
        style[key.replace(/\-([a-z])/g, (_2, lc) => lc.toUpperCase())] = val;
      }
    }
    return style;
  } else {
    return {};
  }
};
var fixContainer = function(parentWidth, parentHeight, childWidth, childHeight) {
  const pw = parseFloat(parentWidth);
  const ph = parseFloat(parentHeight);
  const cw = parseFloat(childWidth);
  const ch = parseFloat(childHeight);
  if (!isNaN(pw) && !isNaN(ph) && !isNaN(cw) && !isNaN(ch)) {
    const parentRate = ph / pw;
    const childRate = ch / cw;
    if (!isNaN(parentRate) && !isNaN(childRate)) {
      let width = 0;
      let height = 0;
      if (parentRate > childRate) {
        width = pw;
        height = pw / cw * ch;
      } else {
        height = ph;
        width = ph / ch * cw;
      }
      return toStyleStr({
        height,
        width
      }, "px");
    }
  }
  return "";
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fixContainer,
  toStyleObj,
  toStyleStr
});
