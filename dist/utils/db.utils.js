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

// src/utils/db.utils.ts
var db_utils_exports = {};
__export(db_utils_exports, {
  default: () => db_utils_default
});
module.exports = __toCommonJS(db_utils_exports);

// src/lib/storage.ts
var isStr = function(str) {
  return typeof str === "string" && str !== "";
};
var isNum = function(num) {
  return typeof num === "number" && !isNaN(num);
};
var checkKey = function(key) {
  return new Promise((resolve, reject) => {
    if (isStr(key) || isNum(key)) {
      resolve(key);
    } else {
      reject("\u952E\u503C\u4E0D\u5B58\u5728");
    }
  });
};
var checkKeySync = function(key) {
  if (isStr(key) || isNum(key)) {
    return true;
  } else {
    throw new Error("\u4FDD\u5B58\u7684\u952E\u5FC5\u987B\u662F\u5408\u6CD5\u5B57\u7B26\u4E32");
  }
};
var CommonStorage = class {
  constructor(api, unifyErrFunc) {
    this.error = console.error;
    this.storageApi = api;
    if (unifyErrFunc) {
      this.error = unifyErrFunc;
    }
  }
  setStorage(key, data) {
    return new Promise((resolve, reject) => {
      checkKey(key).then((k) => {
        this.storageApi.setStorage({
          key: k,
          data,
          success: ({ errMsg }) => {
            resolve(data);
          },
          fail: ({ errMsg }) => {
            reject(errMsg);
          }
        });
      }).catch(reject);
    });
  }
  setStorageSync(key, data) {
    try {
      checkKeySync(key);
      this.storageApi.setStorageSync(key, data);
      return data;
    } catch (err) {
      this.error("\u83B7\u53D6\u7F13\u5B58\u9519\u8BEF=>", err);
      return null;
    }
  }
  getStorage(key) {
    return new Promise((resolve, reject) => {
      checkKey(key).then((k) => {
        this.storageApi.getStorage({
          key: k,
          success: ({ data, errMsg }) => {
            resolve(data);
          },
          fail: ({ errMsg }) => {
            reject(errMsg);
          }
        });
      }).catch(reject);
    });
  }
  getStorageSync(key) {
    try {
      checkKeySync(key);
      return this.storageApi.getStorageSync(key);
    } catch (err) {
      this.error("\u83B7\u53D6\u7F13\u5B58\u9519\u8BEF=>", err);
      return null;
    }
  }
  removeStorage(key) {
    return new Promise((resolve, reject) => {
      checkKey(key).then((k) => {
        this.storageApi.removeStorage({
          key: k,
          success: () => {
            resolve(true);
          },
          fail: ({ errMsg }) => {
            reject(errMsg);
          }
        });
      }).catch(reject);
    });
  }
  clearStorage() {
    return new Promise((resolve, reject) => {
      this.storageApi.clearStorage({
        success: ({ errMsg }) => {
          resolve(true);
        },
        fail: ({ errMsg }) => {
          reject(errMsg);
        }
      });
    });
  }
};

// src/utils/db.utils.ts
var saveJsonKey = function(key) {
  return key + "sskj-json";
};
var setSessionStorage = function(key, data) {
  try {
    let saveKey = key + "";
    let saveData = data;
    if (typeof data !== "string") {
      saveKey = saveJsonKey(key);
      saveData = JSON.stringify(data);
    }
    sessionStorage.setItem(saveKey, saveData);
    return null;
  } catch (err) {
    return err;
  }
};
var getSessionStorage = function(key) {
  const getVal = (k) => sessionStorage.getItem(k);
  let val = getVal(saveJsonKey(key));
  if (typeof val === "string") {
    return JSON.parse(val);
  } else {
    return getVal(key);
  }
};
var db_utils_default = new CommonStorage({
  setStorage(options) {
    const { key, data, success, fail } = options;
    const err = setSessionStorage(key, data);
    if (err === null) {
      if (success) {
        success({ errMsg: "setStorage:ok", err });
      }
      return true;
    } else {
      if (fail) {
        fail({ errMsg: "\u4FDD\u5B58\u9519\u8BEF", err });
      }
      return false;
    }
  },
  setStorageSync(key, data) {
    const err = setSessionStorage(key, data);
    if (err == null) {
      return true;
    } else {
      console.warn("\u4FDD\u5B58sessionStorage\u9519\u8BEF", err);
      return false;
    }
  },
  getStorage(options) {
    const { key, success, fail } = options;
    try {
      const data = getSessionStorage(key);
      if (success) {
        success({ data });
      }
      return true;
    } catch (err) {
      if (fail) {
        fail({ errMsg: "\u83B7\u53D6\u503C\u9519\u8BEF", err });
      }
      return false;
    }
  },
  getStorageSync(key) {
    try {
      return getSessionStorage(key);
    } catch (err) {
      console.warn("\u83B7\u53D6sessionStorage\u9519\u8BEF", err);
      return void 0;
    }
  },
  removeStorage(options) {
    const { key, success, fail } = options;
    try {
      sessionStorage.removeItem(key + "");
      if (success) {
        success({ errMsg: "removeStorage:ok" });
      }
      return true;
    } catch (err) {
      if (fail) {
        fail({ errMsg: "\u83B7\u53D6\u503C\u9519\u8BEF", err });
      }
      return false;
    }
  },
  clearStorage(options) {
    const { success, fail } = options;
    try {
      sessionStorage.clear();
      if (success) {
        success({ errMsg: "clearStorage:ok" });
      }
      return true;
    } catch (err) {
      if (fail) {
        fail({ errMsg: "\u83B7\u53D6\u503C\u9519\u8BEF", err });
      }
      return false;
    }
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
