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

// src/utils/time.utils.ts
var time_utils_exports = {};
__export(time_utils_exports, {
  date2str: () => date2str,
  dateStr2Timestamp: () => dateStr2Timestamp,
  getCurrentStamp: () => getCurrentStamp,
  getCurrentTimeStr: () => getCurrentTimeStr,
  getDayRange: () => getDayRange,
  now: () => now,
  personalize2DateStr: () => personalize2DateStr,
  timeStr2dateStr: () => timeStr2dateStr,
  timeStr2datetimeStr: () => timeStr2datetimeStr,
  timestamp2dateStr: () => timestamp2dateStr,
  timestamp2datetimeStr: () => timestamp2datetimeStr,
  timestamp2str: () => timestamp2str,
  toCurrentSeconds: () => toCurrentSeconds,
  toDateTime: () => toDateTime
});
module.exports = __toCommonJS(time_utils_exports);

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
var isNum = function(num) {
  return typeof num === "number" && !isNaN(num);
};

// src/utils/time.utils.ts
var toDateObj = function(date) {
  if (/^\d{8}$/.test(date)) {
    date = (date + "").replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
  } else if (/^\d{0,1}\d{3}$/.test(date)) {
    date = new Date().getFullYear() + (date + "").replace(/^(\d{0,1})(\d)(\d{2})$/, (_, $1, $2, $3) => `-${$1.length > 0 ? "" : "0"}${$2}-${$3}`);
  }
  let newDate = new Date(date);
  if (isNaN(newDate.getTime())) {
    return new Date(0);
  } else {
    return newDate;
  }
};
var toDateTime = function(date, time, format = "YY-MM-DD hh:mm:ss") {
  const dateObj = toDateObj(date);
  if (isStr(time) || isNum(time)) {
    var timeS = 0;
    (time + "").replace(/^(\d+)(\d{2})$/, function(_, _h, _m) {
      var h = parseInt(_h);
      h = isNaN(h) ? 0 : h >= 0 && h <= 23 ? h : 0;
      timeS += h * 3600;
      var m = parseInt(_m);
      m = isNaN(m) ? 0 : m >= 0 && m <= 59 ? m : 0;
      timeS += m * 60;
      return "";
    });
    timeS -= 8 * 3600;
    return date2str(dateObj.getTime() + timeS * 1e3, format);
  } else {
    return date2str(dateObj, format);
  }
};
var date2str = function(date, format = "YY-MM-DD hh:mm:ss") {
  date = toDateObj(date);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  if (isNaN(year)) {
    return "";
  } else {
    let get2LenStr = (val) => val >= 10 ? val : "0" + val;
    let timeStr = format.replace(/YY/g, year).replace(/Y/g, (year + "").slice(2)).replace(/MM/g, get2LenStr(month)).replace(/M/g, month).replace(/DD/g, get2LenStr(day)).replace(/D/g, day).replace(/hh/g, get2LenStr(h)).replace(/h/g, h).replace(/mm/g, get2LenStr(m)).replace(/m/g, m).replace(/ss/g, get2LenStr(s)).replace(/s/g, s);
    return timeStr;
  }
};
var now = function(format = "YY-MM-DD") {
  return date2str(new Date(), format);
};
var getCurrentTimeStr = (format = "YY-MM-DD hh:mm") => {
  return date2str(new Date(), format);
};
var getCurrentStamp = () => {
  return new Date().getTime();
};
var timestamp2str = (timestamp, format) => {
  return date2str(new Date(timestamp), format);
};
var timestamp2dateStr = (timestamp) => {
  return date2str(new Date(timestamp), "YY-MM-DD");
};
var timestamp2datetimeStr = (timestamp) => {
  return date2str(timestamp, "YY-MM-DD hh:mm:ss");
};
var timeStr2dateStr = (timeStr) => {
  return date2str(timeStr, "YY-MM-DD");
};
var dateStr2Timestamp = (timeStr) => {
  return toDateObj(timeStr).getTime();
};
var timeStr2datetimeStr = (time2str) => {
  return date2str(time2str, "YY-MM-DD hh:mm:ss");
};
var personalize2DateStr = (timeStr, format = "YY\u5E74MM\u6708DD\u65E5") => {
  return date2str(timeStr, format);
};
var toCurrentSeconds = (timeStr) => {
  return (getCurrentStamp() - dateStr2Timestamp(timeStr)) / 1e3;
};
var dayStartStr = " 00:00:00";
var dayEndStr = " 23:59:59";
var dayMilliseconds = 24 * 60 * 60 * 1e3;
var getDayRange = function(day = 0) {
  const todayYmd = now("YY-MM-DD");
  const range = [todayYmd + dayStartStr, todayYmd + dayEndStr];
  const dayYmd = timestamp2str(getCurrentStamp() + day * dayMilliseconds, "YY-MM-DD");
  if (day < 0) {
    range[0] = dayYmd + dayStartStr;
  } else {
    range[1] = dayYmd + dayEndStr;
  }
  return range;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  date2str,
  dateStr2Timestamp,
  getCurrentStamp,
  getCurrentTimeStr,
  getDayRange,
  now,
  personalize2DateStr,
  timeStr2dateStr,
  timeStr2datetimeStr,
  timestamp2dateStr,
  timestamp2datetimeStr,
  timestamp2str,
  toCurrentSeconds,
  toDateTime
});
