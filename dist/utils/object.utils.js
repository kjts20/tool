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

// src/utils/object.utils.ts
var object_utils_exports = {};
__export(object_utils_exports, {
  biList2Dict: () => biList2Dict,
  deepClone: () => deepClone,
  dict2List: () => dict2List,
  filterObj: () => filterObj,
  getArray: () => getArray,
  getChangeData: () => getChangeData,
  getColumnValue: () => getColumnValue,
  getColumnValueAndRenderByName: () => getColumnValueAndRenderByName,
  getListIndex: () => getListIndex,
  getListMax: () => getListMax,
  getListSum: () => getListSum,
  getValueIndex: () => getValueIndex,
  isSame: () => isSame,
  json2Obj: () => json2Obj,
  list2Dict: () => list2Dict,
  listAddition: () => listAddition,
  listConcat: () => listConcat,
  listGroupBy: () => listGroupBy,
  listRemoteRepeat: () => listRemoteRepeat,
  mergeObj: () => mergeObj,
  objEq: () => objEq,
  removeObjColumns: () => removeObjColumns,
  removeObjectUndefined: () => removeObjectUndefined,
  setDictValue: () => setDictValue,
  toJson: () => toJson,
  toObj: () => toObj
});
module.exports = __toCommonJS(object_utils_exports);

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

// src/utils/url.utils.ts
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

// src/utils/object.utils.ts
var getColumnValue = function(data, name, defaultValue) {
  if (data) {
    if (name) {
      var nameArr = [];
      if (isStr(name)) {
        nameArr = name.split(".");
      } else if (isArr(name)) {
        nameArr = name;
      } else {
        nameArr.push(name);
      }
      var i = 0;
      let newData = data;
      if (nameArr.length > 0) {
        if (typeof newData === "object" && newData !== null) {
          const arrRe = /^\s*(.*?)\[(\d+)\]\s*$/;
          const getVal = (data2, key) => {
            if (isObj(data2)) {
              if (arrRe.test(key)) {
                const [newKey, index] = key.match(arrRe);
                data2 = data2[newKey];
                if (isObj(data2)) {
                  return data2[index];
                } else {
                  return defaultValue;
                }
              } else {
                return data2[key + ""] || defaultValue;
              }
            } else {
              return defaultValue;
            }
          };
          do {
            newData = getVal(newData, nameArr[i]);
            i++;
          } while (nameArr.length > i && typeof newData === "object" && newData !== null);
        }
        return newData || defaultValue;
      } else {
        return defaultValue;
      }
    } else {
      return data;
    }
  } else {
    return defaultValue;
  }
};
var setDictValue = function(data, name, value) {
  if (!data) {
    data = {};
  }
  var nameArr = [];
  if (isStr(name)) {
    nameArr = name.split(".");
  } else if (isArr(name)) {
    nameArr = name;
  } else {
    nameArr.push(name);
  }
  let tempData = data;
  const lastName = nameArr.pop();
  for (const it of nameArr) {
    if (!isObj(tempData[it])) {
      tempData[it] = {};
    }
    tempData = tempData[it];
  }
  tempData[lastName] = value;
  return data;
};
var getColumnValueAndRenderByName = function(name, data, render = null) {
  if (typeof name === "string") {
    var nameArr = name.split(".");
    var i = 0;
    let newData = data;
    if (nameArr.length > 0) {
      if (typeof newData === "object" && newData !== null) {
        const arrRe = /^\s*(.*?)\[(\d+)\]\s*$/;
        const getVal = (data2, key) => {
          if (typeof data2 === "object" && data2 !== null) {
            if (arrRe.test(key)) {
              const [newKey, index] = key.match(arrRe);
              data2 = data2[newKey];
              if (typeof data2 === "object" && data2 !== null) {
                return data2[index];
              } else {
                return void 0;
              }
            } else {
              return data2[key];
            }
          } else {
            return void 0;
          }
        };
        do {
          newData = getVal(newData, nameArr[i]);
          i++;
        } while (nameArr.length > i && typeof newData === "object" && newData !== null);
      }
      return typeof render === "function" ? render(0, 0, newData) : newData;
    } else {
      return void 0;
    }
  } else {
    return void 0;
  }
};
var deepClone = function(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    return obj;
  }
};
var toJson = (str) => {
  try {
    if (typeof str === "string" && str !== "") {
      const removeSenseRe = /([:\{\[,])\\"(.*?)\\"([:\}\],])/g;
      if (removeSenseRe.test(str)) {
        const removeText = '$1"$2"$3';
        str = str.replace(removeSenseRe, removeText).replace(removeSenseRe, removeText);
      }
      return JSON.parse(str);
    } else if (typeof str === "object") {
      return str;
    } else {
      console.warn("\u4E0D\u6B63\u786E\u7684json\u5B57\u7B26\u4E32", str);
      return str;
    }
  } catch (err) {
    console.error("\u8F6Cjson\u5BF9\u8C61\u5931\u8D25", err);
    return str;
  }
};
var getArray = function(length, fill) {
  let len = parseInt(length) || 0;
  let totalList = ",".repeat(len).split(",").map((_) => fill);
  totalList.pop();
  return totalList;
};
var filterObj = function(obj, itemDecorate) {
  if (isObj(obj)) {
    const newObj = {};
    let itemFunc = typeof itemDecorate === "function" ? itemDecorate : (val) => val;
    for (const k in obj) {
      const it = obj[k];
      if (k && k !== "undefined" && it && it != "undefined") {
        newObj[k] = itemFunc(it);
      }
    }
    return newObj;
  } else {
    return {};
  }
};
var list2Dict = function(data, column = "id", itMapHandler) {
  if (typeof column !== "string" || column === "") {
    console.warn("list2Dict\u5B57\u6BB5\u4E0D\u5408\u6CD5\uFF0C\u5DF2\u7ECF\u4F7F\u7528\u9ED8\u8BA4\u5B57\u6BB5id", column);
    column = "id";
  }
  return biList2Dict(data, (it) => it[column], itMapHandler);
};
var biList2Dict = function(data, keyGenerater, itMapHandler) {
  if (Array.isArray(data)) {
    const itHanlder = itMapHandler && isFunc(itMapHandler) ? itMapHandler : (it) => it;
    const newDict = {};
    data.forEach((it) => {
      const key = keyGenerater(it);
      if (isStr(key) || isNum(key)) {
        newDict[key] = itHanlder(it);
      }
    });
    return newDict;
  } else if (typeof data === "object" && data !== null) {
    return data;
  } else {
    console.warn("list2Dict\u6570\u636E\u9519\u8BEF", data);
    return {};
  }
};
var dict2List = function(data, keyColumn) {
  if (Array.isArray(data)) {
    return data;
  } else if (typeof data === "object" && data !== null) {
    const newArr = [];
    for (const k in data) {
      const it = data[k];
      if (isObj(it)) {
        if (keyColumn) {
          it[keyColumn] = k;
        }
      }
      newArr.push(it);
    }
    return newArr;
  } else {
    return [];
  }
};
var objEq = function(obj1, obj2) {
  if (isObj(obj1) && isObj(obj2)) {
    const obj1Key = Object.keys(obj1);
    const obj2Key = Object.keys(obj2);
    if (obj1Key.length == obj2Key.length) {
      for (let i = 0; i < obj1Key.length; i++) {
        let k = obj1Key[i];
        if (!obj2Key.includes(k) || JSON.stringify(urlDecode(obj1[k])) !== JSON.stringify(urlDecode(obj2[k]))) {
          return false;
        }
      }
      return true;
    }
  }
  return false;
};
var json2Obj = function(str) {
  if (isStr(str)) {
    try {
      return JSON.parse(str);
    } catch (err) {
      console.warn("\u8F6C\u5BF9\u8C61\u9519\u8BEF=>", str, err);
      return str;
    }
  } else {
    return str;
  }
};
var getListIndex = function(list, predicate) {
  if (isArr(list) && isFunc(predicate)) {
    for (let i = 0; i < list.length; i++) {
      if (predicate(list[i])) {
        return i;
      }
    }
  }
  return -1;
};
var listRemoteRepeat = function(data, column = "id", filter = (it) => it) {
  const newList = data.map((it) => filter({ ...it }));
  const dict = list2Dict(newList, column);
  return dict2List(dict, "");
};
var mergeObj = function(baseConfig, ...configs) {
  const conf = { ...baseConfig || {} };
  function merge(conf1, conf2) {
    if (isObj(conf1) && isObj(conf2)) {
      for (const k in conf2) {
        if (isObj(conf1[k]) && isObj(conf2[k])) {
          merge(conf1[k], conf2[k]);
        } else {
          try {
            conf1[k] = conf2[k];
          } catch (e) {
            console.error("\u5C5E\u6027\u65E0\u6CD5\u5199\u5165=>", e);
            console.log(typeof conf1[k], typeof conf2[k]);
          }
        }
      }
    }
  }
  for (const config of configs) {
    merge(conf, config);
  }
  return conf;
};
var removeObjColumns = function(obj, ...columns) {
  const goal = { ...obj || {} };
  for (const column of columns) {
    delete goal[column];
  }
  return goal;
};
var removeObjectUndefined = function(obj) {
  if (obj != null) {
    for (const key in obj) {
      if (typeof obj[key] === "undefined")
        delete obj[key];
    }
    return obj;
  } else {
    return {};
  }
};
var isSame = function(arg1, arg2) {
  if (!isObj(arg1) && !isObj(arg2)) {
    return arg1 == arg2;
  } else {
    return JSON.stringify(arg1) === JSON.stringify(arg2);
  }
};
var getChangeData = function(before, after) {
  if (before == null) {
    return after || {};
  } else if (after == null) {
    return before || {};
  } else {
    const changeData = {};
    const beforeKeys = Object.keys(before);
    for (const key in after) {
      const it = after[key];
      if (!beforeKeys.includes(key) || !isSame(before[key], it)) {
        changeData[key] = it;
      }
    }
    return changeData;
  }
};
var listGroupBy = function(list, keyName) {
  const dict = {};
  if (list && list.length > 0 && isStr(keyName)) {
    list.forEach((it) => {
      if (it) {
        const groupKey = it[keyName];
        if (!isArr(dict[groupKey])) {
          dict[groupKey] = [];
        }
        dict[groupKey].push(it);
      }
    });
  }
  return dict;
};
var getListSum = function(list, getNumFunc) {
  let sum = 0;
  if (list && isArr(list)) {
    for (const it of list) {
      if (it) {
        sum += getNumFunc(it);
      }
    }
  }
  return sum;
};
var getListMax = function(list, getNumFunc) {
  let max = 0;
  if (list && isArr(list)) {
    for (const it of list) {
      if (it) {
        const num = getNumFunc(it);
        if (max < num) {
          max = num;
        }
      }
    }
  }
  return max;
};
var listConcat = function(list, itemList) {
  if (!isArr(list)) {
    list = [];
  }
  if (isArr(itemList)) {
    for (const item of itemList) {
      list.push(item);
    }
    return list;
  } else {
    return list;
  }
};
var listAddition = function(list, addNum) {
  if (!isArr(list) || list.length > 0)
    return list;
  const newList = [...list];
  if (typeof addNum === "number") {
    const num = Number(addNum) || 0;
    for (let i = 0; i < newList.length; i++) {
      newList[i] = (Number(newList[i]) || 0) + num;
    }
  } else {
    for (let i = 0; i < newList.length; i++) {
      newList[i] = (Number(newList[i]) || 0) + (Number(addNum[i]) || 0);
    }
  }
  return newList;
};
var toObj = function(key, val) {
  const obj = {};
  obj[key] = val;
  return obj;
};
var getValueIndex = function(listData, findHandler) {
  for (let i = 0; i < listData.length; i++) {
    if (findHandler(listData[i])) {
      return i;
    }
  }
  return -1;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  biList2Dict,
  deepClone,
  dict2List,
  filterObj,
  getArray,
  getChangeData,
  getColumnValue,
  getColumnValueAndRenderByName,
  getListIndex,
  getListMax,
  getListSum,
  getValueIndex,
  isSame,
  json2Obj,
  list2Dict,
  listAddition,
  listConcat,
  listGroupBy,
  listRemoteRepeat,
  mergeObj,
  objEq,
  removeObjColumns,
  removeObjectUndefined,
  setDictValue,
  toJson,
  toObj
});
