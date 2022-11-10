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

// src/utils/string.utils.ts
var string_utils_exports = {};
__export(string_utils_exports, {
  allSpace: () => allSpace,
  camelToKebab: () => camelToKebab,
  generateRandomStr: () => generateRandomStr,
  generateUUID: () => generateUUID,
  generateUnique: () => generateUnique,
  isEmail: () => isEmail,
  isPhone: () => isPhone,
  isTel: () => isTel,
  md5: () => md5,
  trim: () => trim
});
module.exports = __toCommonJS(string_utils_exports);

// src/utils/lib/md5.ts
function safe_add(x, y) {
  var lsw = (x & 65535) + (y & 65535);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 65535;
}
function rol(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
function cmn(q, a, b, x, s, t) {
  return safe_add(rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}
function ff(a, b, c, d, x, s, t) {
  return cmn(b & c | ~b & d, a, b, x, s, t);
}
function gg(a, b, c, d, x, s, t) {
  return cmn(b & d | c & ~d, a, b, x, s, t);
}
function hh(a, b, c, d, x, s, t) {
  return cmn(b ^ c ^ d, a, b, x, s, t);
}
function ii(a, b, c, d, x, s, t) {
  return cmn(c ^ (b | ~d), a, b, x, s, t);
}
function coreMD5(x) {
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;
  for (var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    a = ff(a, b, c, d, x[i + 0], 7, -680876936);
    d = ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i + 10], 17, -42063);
    b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = gg(b, c, d, a, x[i + 0], 20, -373897302);
    a = gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = hh(a, b, c, d, x[i + 5], 4, -378558);
    d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = hh(d, a, b, c, x[i + 0], 11, -358537222);
    c = hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = ii(a, b, c, d, x[i + 0], 6, -198630844);
    d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return [a, b, c, d];
}
function binl2hex(binarray) {
  var hex_tab = "0123456789abcdef";
  var str = "";
  for (var i = 0; i < binarray.length * 4; i++) {
    str += hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 + 4 & 15) + hex_tab.charAt(binarray[i >> 2] >> i % 4 * 8 & 15);
  }
  return str;
}
function str2binl(str) {
  var nblk = (str.length + 8 >> 6) + 1;
  var blks = new Array(nblk * 16);
  for (var i = 0; i < nblk * 16; i++)
    blks[i] = 0;
  for (var i = 0; i < str.length; i++)
    blks[i >> 2] |= (str.charCodeAt(i) & 255) << i % 4 * 8;
  blks[i >> 2] |= 128 << i % 4 * 8;
  blks[nblk * 16 - 2] = str.length * 8;
  return blks;
}
function hexMD5(str) {
  return binl2hex(coreMD5(str2binl(str)));
}

// src/utils/type.utils.ts
var isStr = function(str) {
  return typeof str === "string" && trim(str) !== "";
};
var isFunc = function(func) {
  return func && typeof func === "function";
};

// src/utils/string.utils.ts
var allSpace = "\u3000";
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
var md5 = function(str) {
  return hexMD5(str);
};
var generateRandomStr = function(len) {
  len = parseInt(len);
  len = isNaN(len) || len <= 0 ? 7 : len;
  var seed = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "q",
    "u",
    "v",
    "w",
    "y",
    "z",
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9
  ];
  var str = "";
  var seedLen = seed.length;
  for (var i = 0; i < len; i++) {
    str += seed[Math.floor(Math.random() * seedLen)];
  }
  return str;
};
var generateUUID = function() {
  return generateUnique("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx");
};
var generateUnique = function(seed = 5, codingBits = 16) {
  (typeof codingBits !== "number" || codingBits < 2 || codingBits > 36) && (codingBits = 16);
  if (typeof seed === "number" && seed > 0) {
    seed = "x".repeat(seed) + "y";
  } else if (typeof seed !== "string" || seed.length < 2) {
    seed = "xxxxxxy";
  }
  var d = new Date().getTime();
  const performance = window.performance;
  if (performance && isFunc(performance.now)) {
    d += performance.now();
  }
  var uuid = seed.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * codingBits) % codingBits | 0;
    d = Math.floor(d / codingBits);
    return (c === "x" ? r : r & 3 | codingBits / 2).toString(codingBits);
  });
  return uuid;
};
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
var isTel = function(str) {
  return judgeFormat(str, /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  allSpace,
  camelToKebab,
  generateRandomStr,
  generateUUID,
  generateUnique,
  isEmail,
  isPhone,
  isTel,
  md5,
  trim
});
