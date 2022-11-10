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

// src/lib/http-server.ts
var http_server_exports = {};
__export(http_server_exports, {
  default: () => HttpServer,
  errResponse: () => errResponse,
  successResponse: () => successResponse,
  unifiedResponse: () => unifiedResponse
});
module.exports = __toCommonJS(http_server_exports);

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

// src/lib/http-server.ts
var getHeader = function(...headers) {
  let useHeader = {};
  for (const header of headers) {
    useHeader = { ...isObj(header) ? header : {} };
  }
  return useHeader;
};
var unifiedResponse = function(response) {
  if (!response) {
    response = {
      errcode: 1,
      code: 500,
      data: null,
      msg: "\u7CFB\u7EDF\u9519\u8BEF"
    };
  }
  const { code, errcode, msg } = response;
  const httpResponse = {
    ...response,
    success: true,
    fail: false,
    error: false,
    timeout: false
  };
  if (errcode === 0) {
    if (code === 200) {
      httpResponse.success = true;
      httpResponse.fail = false;
      httpResponse.error = false;
    } else if (isNum(code)) {
      httpResponse.success = false;
      httpResponse.fail = true;
      httpResponse.error = false;
    } else {
      httpResponse.success = true;
      httpResponse.code = 200;
      httpResponse.fail = false;
      httpResponse.error = false;
    }
  } else if (errcode === 1) {
    httpResponse.success = false;
    httpResponse.fail = false;
    httpResponse.error = true;
    if (isNum(code)) {
      httpResponse.code = 500;
    }
  } else {
    httpResponse.success = false;
    httpResponse.fail = false;
    httpResponse.error = true;
    httpResponse.msg = "\u63A5\u53E3\u9519\u8BEF";
  }
  if (!isStr(msg)) {
    httpResponse.msg = httpResponse.error ? "\u7CFB\u7EDF\u9519\u8BEF" : httpResponse.success ? "success" : "\u5931\u8D25";
  }
  return httpResponse;
};
var successResponse = function(msg, data = null) {
  return unifiedResponse({
    code: 200,
    errcode: 0,
    msg,
    data
  });
};
var errResponse = function(msg, data = null) {
  return unifiedResponse({
    errcode: 1,
    code: 500,
    msg,
    data
  });
};
var HttpServer = class {
  constructor(options) {
    this.apiServer = "";
    this.host = "";
    this.error = console.error;
    this.responseIntercept = (response) => response;
    const { apiPrefix, host, getHeader: getHeader2, error, request, uploadFile, responseIntercept } = options;
    this.apiServer = `${trim(host, "/")}/${trim(apiPrefix, "/")}`;
    this.host = host;
    if (isFunc(getHeader2)) {
      this.getHeader = getHeader2;
    }
    if (isFunc(error)) {
      this.error = error;
    }
    this.request = request;
    this.uploadFile = uploadFile;
    if (responseIntercept) {
      this.responseIntercept = responseIntercept;
    }
  }
  getRequestUrl(url) {
    if (/^http[s]:\/\/.*?$/g.test(url)) {
      return url;
    } else {
      return `${trim(this.apiServer, "/")}/${trim(url, "/")}`;
    }
  }
  ajax(url, data, method, header = {}, options) {
    return new Promise((resolve, reject) => {
      let requestUrl = this.getRequestUrl(url);
      let requestBody = data || {};
      if (method === "GET" /* GET */) {
        requestUrl = mergeUrl(requestUrl, requestBody);
        requestBody = {};
      }
      const requestOptions = {};
      if (options) {
        for (const k in options) {
          requestOptions[k] = options[k];
        }
      }
      this.request({
        url: requestUrl,
        data: requestBody,
        header: getHeader(header, this.getHeader()),
        ...requestOptions,
        method,
        success: function(response) {
          const { statusCode } = response;
          const res = response.data;
          if (statusCode == 200 && isObj(res)) {
            if (Object.keys(res).length <= 0) {
              resolve(successResponse("arrayBuffer\u751F\u6210\u6210\u529F", res));
            } else {
              resolve(this.responseIntercept(unifiedResponse(res)));
            }
          } else {
            const msg = (isObj(res) ? res.msg : null) || "\u7CFB\u7EDF\u9519\u8BEF";
            reject(
              unifiedResponse({
                code: statusCode,
                errcode: 1,
                msg,
                data
              })
            );
          }
        },
        error: function(err) {
          reject(
            unifiedResponse({
              code: 600,
              errcode: 1,
              msg: err && err.msg || "\u7CFB\u7EDF\u9519\u8BEF",
              data: err
            })
          );
        },
        complete: function(res) {
          const { errMsg } = res;
          if (/^request:fail\s+timeout$/.test(errMsg)) {
            const resp = errResponse("\u7CFB\u7EDF\u9519\u8BEF", res);
            resp.msg = "\u7F51\u7EDC\u5F02\u5E38";
            resp.timeout = true;
            reject(resp);
          }
        }
      });
    });
  }
  upload(url, filePath, data, header = {}, options) {
    return new Promise((resolve, reject) => {
      const requestOptions = {
        timeout: 5 * 60 * 1e3,
        ...options || {}
      };
      const { name = "file" } = requestOptions;
      delete requestOptions[name];
      this.uploadFile({
        ...requestOptions,
        url: this.getRequestUrl(url),
        filePath: isObj(filePath) ? filePath.tempFilePath || filePath.path : filePath,
        name,
        formData: data || {},
        header: getHeader(header),
        success: function(response) {
          const { statusCode } = response;
          const resData = response.data;
          const res = isObj(resData) ? resData : JSON.parse(resData);
          if (statusCode === 200 && isObj(res)) {
            resolve(this.responseIntercept(unifiedResponse(res)));
          } else {
            const msg = (isObj(res) ? res.msg : null) || "\u7CFB\u7EDF\u9519\u8BEF";
            reject(
              unifiedResponse({
                code: statusCode,
                errcode: 1,
                msg,
                data
              })
            );
          }
        },
        fail: function(err) {
          reject(
            unifiedResponse({
              code: 600,
              errcode: 1,
              msg: err && err.errMsg || "\u7CFB\u7EDF\u9519\u8BEF",
              data: err
            })
          );
        },
        complete: function(res) {
          const { errMsg } = res;
          if (/^request:fail\s+timeout$/.test(errMsg)) {
            const resp = errResponse("\u7CFB\u7EDF\u9519\u8BEF", res);
            resp.msg = "\u7F51\u7EDC\u5F02\u5E38";
            resp.timeout = true;
            reject(resp);
          }
        }
      });
    });
  }
  get(url, data = {}, options, header = {}) {
    return this.ajax(url, data, "GET" /* GET */, header, options);
  }
  put(url, data = {}, options, header = {}) {
    return this.ajax(
      url,
      data,
      "PUT" /* PUT */,
      {
        "Content-Type": "application/json",
        ...header || {}
      },
      options
    );
  }
  del(url, data = {}, options, header = {}) {
    const params = {};
    const requestData = isObj(data) ? data : {};
    for (const key in requestData) {
      const it = requestData[key];
      if (isArr(it)) {
        params[key] = it.join(",");
      } else if (isNum(it) || isStr(it)) {
        params[key] = it;
      }
    }
    return this.ajax(
      mergeUrl(url, params),
      data,
      "DELETE" /* DELETE */,
      {
        "Content-Type": "application/json",
        ...header || {}
      },
      options
    );
  }
  post(url, data = {}, options, header = {}) {
    return this.ajax(
      url,
      data,
      "POST" /* POST */,
      {
        "Content-Type": "application/x-www-form-urlencoded",
        ...header || {}
      },
      options
    );
  }
  postJson(url, data = {}, options, header = {}) {
    return this.ajax(
      url,
      data,
      "POST" /* POST */,
      {
        "Content-Type": "application/json",
        ...header || {}
      },
      options
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  errResponse,
  successResponse,
  unifiedResponse
});
