/*
 * @Author: wkj（wkj.kjwoo.cn）
 * @Date: 2022-12-07 22:24:31
 * @LastEditTime: 2023-07-08 11:20:16
 * @Description:  类型工具
 */
import { trim } from './string';

export const isFunction = function (func) {
    return typeof func === 'function';
};

// 是否所有都是undefined
export const isUndefined = function (...args) {
    if (Array.isArray(args) && args.length > 0) {
        let uNum = 0;
        for (var i = 0; i < args.length; i++) {
            let it = args[i];
            if (typeof it === 'undefined') {
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

// 是否所有都是undefined或者null
export const isUndefinedOrNull = function (...args) {
    if (Array.isArray(args) && args.length > 0) {
        let uNum = 0;
        for (var i = 0; i < args.length; i++) {
            let it = args[i];
            if (typeof it === 'undefined' || it === null) {
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

// 是否非空对象
export const isObj = function (obj) {
    return typeof obj === 'object' && obj !== null;
};

// 是否字符串
export const isStr = function (str) {
    return typeof str === 'string' && trim(str) !== '';
};

// 是否数字
export const isNum = function (num) {
    return typeof num === 'number' && !isNaN(num);
};

// 是否可用数字
export const isNumStr = function (num) {
    return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(num);
};

// 是否整数
export const isInitStr = function (num) {
    return /^\d+$/.test(num);
};

// 是否函数
export const isFunc = function (func) {
    return func && typeof func === 'function';
};

// 是否数组
export const isArr = function (arr) {
    return Array.isArray(arr);
};

// 是否bool
export const isBool = function (bool) {
    return typeof bool === 'boolean';
};
