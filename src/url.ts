/*
 * @Author: wkj（wkj.kjwoo.cn）
 * @Date: 2023-04-21 18:25:49
 * @LastEditTime: 2023-07-08 10:47:32
 * @Description: 工具类：url相关的工具
 */

import { isStr } from './type';

//请求字符串转换对象
export const requestStr2Obj = function (requestUrl, valAutoDecode = true) {
    // 如果存在?，那么先获取?之后的内容
    requestUrl = requestUrl.replace(/^.*?\?(.*?)$/, '$1');
    var requestArr = requestUrl.split('&');
    var valueRe = /^([a-zA-Z0-9\_\_]+)=(.*?)$/;
    var paramsObj: { [key: string]: any } = {};
    //查看类型进行转为相应的值
    const val2Real = val => {
        let intRe = /^\d+$/,
            floatRe = /^\d*\.\d*$/,
            trueRe = /^true$/i,
            falseRe = /^false$/i;
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
            const key = it.replace(valueRe, '$1');
            const val = it.replace(valueRe, '$2');
            paramsObj[urlDecode(key)] = val2Real(valAutoDecode ? urlDecode(val) : val);
        }
    }
    return paramsObj;
};

// url加密
export const urlEncode = function (str) {
    const strEncode = function (encodeStr) {
        if (isStr(encodeStr) && urlDecode(encodeStr) !== encodeStr) {
            return encodeStr;
        } else {
            return encodeURIComponent(encodeStr);
        }
    };
    try {
        const json = JSON.parse(str);
        if (json === undefined) {
            return strEncode;
        } else {
            return encodeURIComponent(str);
        }
    } catch (e) {
        return encodeURIComponent(str);
    }
};

// url解密
export const urlDecode = function (str) {
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

//对象转url参数
export const obj2RequestUrl = function (obj) {
    if (typeof obj === 'object' && obj !== null) {
        //去掉function
        var newObj = JSON.parse(JSON.stringify(obj));
        var tempRequestArr: string[] = [];
        for (var i in newObj) {
            var val = newObj[i];
            if (typeof i !== 'string' || i === '') {
                continue;
            } else {
                var key = i;
                var attrStr = '';
                if (Array.isArray(val)) {
                    if (!/\[\]$/.test(key)) {
                        key += '[]';
                    }
                    var valAttr: string[] = [];
                    for (var i in val) {
                        if (typeof val[i] === 'object') {
                            console.error('只是支持一级数组！！！');
                            continue;
                        } else {
                            valAttr.push(key + '=' + urlEncode(val[i]));
                        }
                    }
                    attrStr = valAttr.join('&');
                } else if (typeof val === 'object') {
                    attrStr = key + '=' + urlEncode(JSON.stringify(val));
                } else {
                    attrStr = key + '=' + urlEncode(val);
                }
                tempRequestArr.push(attrStr);
            }
        }
        return tempRequestArr.join('&');
    } else {
        console.error('无法转换，使用Object不合法！！！', obj);
        return '';
    }
};

/**
 * URL合并
 * @param mainUrl 主url（可以包含域名部分）
 * @param param  参数
 */
export const mergeUrl = function (mainUrl, ...param: object[]) {
    if (typeof mainUrl !== 'string') {
        throw new Error('main url main be a string!');
    } else {
        // 合并的参数
        let allRequest = {};
        for (var i = 0; i < param.length; i++) {
            var item = param[i];
            if (typeof item === 'object') {
                Object.assign(allRequest, item);
            } else if (typeof item === 'string') {
                Object.assign(allRequest, requestStr2Obj(item));
            }
        }
        // 对主url进行处理
        const urlParts = mainUrl.split('?');
        let hash = '';
        if (urlParts.length === 2) {
            const hashParts = urlParts[1].split('#');
            Object.assign(allRequest, requestStr2Obj(urlParts[1]));
            if (hashParts.length > 1) {
                hash = '#' + hashParts[1];
            }
        }
        const searchUrl = Object.keys(allRequest).length > 0 ? `?${obj2RequestUrl(allRequest)}` : '';
        return `${urlParts[0]}${searchUrl}${hash}`;
    }
};
