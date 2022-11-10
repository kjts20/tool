var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/lib/base64.js
var require_base64 = __commonJS({
  "src/utils/lib/base64.js"(exports, module2) {
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var a256 = "";
    var r64 = [256];
    var r256 = [256];
    var i = 0;
    var UTF8 = {
      encode: function(strUni) {
        var strUtf = strUni.replace(
          /[\u0080-\u07ff]/g,
          function(c2) {
            var cc = c2.charCodeAt(0);
            return String.fromCharCode(192 | cc >> 6, 128 | cc & 63);
          }
        ).replace(
          /[\u0800-\uffff]/g,
          function(c2) {
            var cc = c2.charCodeAt(0);
            return String.fromCharCode(224 | cc >> 12, 128 | cc >> 6 & 63, 128 | cc & 63);
          }
        );
        return strUtf;
      },
      decode: function(strUtf) {
        var strUni = strUtf.replace(
          /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,
          function(c2) {
            var cc = (c2.charCodeAt(0) & 15) << 12 | (c2.charCodeAt(1) & 63) << 6 | c2.charCodeAt(2) & 63;
            return String.fromCharCode(cc);
          }
        ).replace(
          /[\u00c0-\u00df][\u0080-\u00bf]/g,
          function(c2) {
            var cc = (c2.charCodeAt(0) & 31) << 6 | c2.charCodeAt(1) & 63;
            return String.fromCharCode(cc);
          }
        );
        return strUni;
      }
    };
    while (i < 256) {
      c = String.fromCharCode(i);
      a256 += c;
      r256[i] = i;
      r64[i] = b64.indexOf(c);
      ++i;
    }
    var c;
    function code(s, discard, alpha, beta, w1, w2) {
      s = String(s);
      var buffer = 0, i2 = 0, length = s.length, result = "", bitsInBuffer = 0;
      while (i2 < length) {
        var c2 = s.charCodeAt(i2);
        c2 = c2 < 256 ? alpha[c2] : -1;
        buffer = (buffer << w1) + c2;
        bitsInBuffer += w1;
        while (bitsInBuffer >= w2) {
          bitsInBuffer -= w2;
          var tmp = buffer >> bitsInBuffer;
          result += beta.charAt(tmp);
          buffer ^= tmp << bitsInBuffer;
        }
        ++i2;
      }
      if (!discard && bitsInBuffer > 0)
        result += beta.charAt(buffer << w2 - bitsInBuffer);
      return result;
    }
    var Plugin = function(dir, input, encode) {
      return input ? Plugin[dir](input, encode) : dir ? null : this;
    };
    Plugin.btoa = Plugin.encode = function(plain, utf8encode) {
      plain = Plugin.raw === false || Plugin.utf8encode || utf8encode ? UTF8.encode(plain) : plain;
      plain = code(plain, false, r256, b64, 8, 6);
      return plain + "====".slice(plain.length % 4 || 4);
    };
    Plugin.atob = Plugin.decode = function(coded, utf8decode) {
      coded = coded.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      coded = String(coded).split("=");
      var i2 = coded.length;
      do {
        --i2;
        coded[i2] = code(coded[i2], true, r64, a256, 6, 8);
      } while (i2 > 0);
      coded = coded.join("");
      return Plugin.raw === false || Plugin.utf8decode || utf8decode ? UTF8.decode(coded) : coded;
    };
    module2.exports = {
      btoa: Plugin.btoa,
      atob: Plugin.atob
    };
  }
});

// src/utils/file.utils.ts
var file_utils_exports = {};
__export(file_utils_exports, {
  arrayBufferToBase64Img: () => arrayBufferToBase64Img
});
module.exports = __toCommonJS(file_utils_exports);
var import_base64 = __toESM(require_base64());
var arrayBufferToBase64Img = (buffer) => {
  const str = String.fromCharCode(...new Uint8Array(buffer));
  return `data:image/jpeg;base64,${(0, import_base64.btoa)(str)}`;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  arrayBufferToBase64Img
});
