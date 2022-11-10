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

// src/utils/regexp.utils.ts
var regexp_utils_exports = {};
__export(regexp_utils_exports, {
  replaceSpace: () => replaceSpace
});
module.exports = __toCommonJS(regexp_utils_exports);
var sigleHtmlTag = ["img", "link", "hr", "br", "input"];
var replaceSpace = function(str, replaceText = "&ensp;") {
  let goal = str.replace(/<[a-z0-9-]+.*?\/>/gi, ($0) => encodeURIComponent($0));
  sigleHtmlTag.forEach((it) => {
    goal = goal.replace(new RegExp(`<${it}.*?>`, "gi"), ($0) => encodeURIComponent($0));
  });
  goal = goal.replace(/<([a-z0-9-]+)(.*?)>(.*?)<\/\1\s*>/gi, ($0, $1, $2, $3) => `<${$1}${$2}>${$3.replace(/\s/g, replaceText)}</${$1}>`);
  return decodeURIComponent(goal);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  replaceSpace
});
