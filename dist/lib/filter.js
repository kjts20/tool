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

// src/lib/filter.ts
var filter_exports = {};
__export(filter_exports, {
  ResponseFilter: () => ResponseFilter
});
module.exports = __toCommonJS(filter_exports);

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

// src/lib/filter.ts
var ResponseFilter = class {
  constructor(options) {
    this.error = console.error;
    const { error } = options;
  }
  filter(responsePromise, filterHanlder) {
    return new Promise((resolve, reject) => {
      responsePromise.then((res) => {
        if (res.success) {
          resolve(filterHanlder ? filterHanlder(res.data) : res.data);
        } else if (isUndefined(res.success, res.code, res.errcode)) {
          resolve(filterHanlder ? filterHanlder(res) : res);
        } else {
          reject(res);
        }
      }).catch(reject);
    });
  }
  unifyRemind(responsePromise, filterHanlder, showTip = true) {
    return new Promise((resolve, reject) => {
      responsePromise.then((res) => {
        if (res.success) {
          resolve(filterHanlder ? filterHanlder(res.data) : res.data);
        } else {
          if (showTip) {
            if (res.code === 230) {
              for (const it of res.data) {
                this.error(it.message || "\u7CFB\u7EDF\u5F00\u5C0F\u5DEE\u4E86\uFF5E", res);
                break;
              }
            } else {
              this.error(res.msg || "\u7CFB\u7EDF\u5F00\u5C0F\u5DEE\u4E86\uFF5E", res);
            }
          }
          reject(res);
        }
      }).catch((err) => {
        if (showTip) {
          this.error(err.msg || "\u7CFB\u7EDF\u5F00\u5C0F\u5DEE\u4E86\uFF5E", err);
        }
        reject(err);
      });
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ResponseFilter
});
