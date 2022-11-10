declare const isFunction: (func: any) => boolean;
declare const isUndefined: (...args: any[]) => boolean;
declare const isUndefinedOrNull: (...args: any[]) => boolean;
declare const isObj: (obj: any) => boolean;
declare const isStr: (str: any) => boolean;
declare const isNum: (num: any) => boolean;
declare const isNumStr: (num: any) => boolean;
declare const isFunc: (func: any) => boolean;
declare const isArr: (arr: any) => boolean;
declare const isBool: (bool: any) => boolean;
/**
 * 生成递增或者递减数组
 * @param {number} start 开始值
 * @param {number} end 结束值
 * @param {string} type 类型 add:递增 reduce:递减
 * @return {Array}
 */
declare const createArr: (start: any, end: any, type?: string) => number[];
declare const getLen: (data: any) => any;

export { createArr, getLen, isArr, isBool, isFunc, isFunction, isNum, isNumStr, isObj, isStr, isUndefined, isUndefinedOrNull };
