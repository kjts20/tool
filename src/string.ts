/*
 * @Author: wkj（wkj.kjwoo.cn）
 * @Date: 2023-04-21 18:32:54
 * @LastEditTime: 2023-07-08 11:44:10
 * @Description: 字符串工具类
 */
import { hexMD5 } from './lib/md5';
import { isFunc, isStr, isNum } from './type';

// 全空格
export const allSpace = '　';

/**
 * 替换前后空格获取特定的字符串
 * @param str
 * @param patternStr
 * @param replaceStr
 * @returns
 */
export const trim = function (str, patternStr = '\\s', replaceStr = '') {
    if (typeof str === 'string') {
        patternStr.replace(/\s+/, '') === '' && (patternStr = '\\s');
        let re = new RegExp(`^(${patternStr})*(.*?)(${patternStr})*$`);
        return str.replace(re, function (_, one, two, three) {
            let returnStr = '';
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

// md5加密
export const md5 = function (str) {
    return hexMD5(str);
};

// 生成因子（a-zA-Z0-9）
export const numSeed = '0'
    .repeat(10)
    .split('')
    .map((_, i) => i);
export const letterUpSeed = '0'
    .repeat(26)
    .split('')
    .map((_, i) => String.fromCharCode(i + 65));
export const letterLowSeed = '0'
    .repeat(26)
    .split('')
    .map((_, i) => String.fromCharCode(i + 97));

/**
 * 获取随机字符串
 * @param len 长度
 * @param seed
 * @returns
 */
export const generateRandomStr = function (len = 7, seed = [...numSeed, ...letterUpSeed, ...letterLowSeed]) {
    if (isNum(len) && len > 0) {
        var str = '';
        var seedLen = seed.length;
        for (var i = 0; i < len; i++) {
            str += seed[Math.floor(Math.random() * seedLen)];
        }
        return str;
    } else {
        throw new Error('生成随机字符串错误，长度必须大于0');
    }
};

/**
 * 生成命名
 * @param len
 * @param firstSeed 首字母生成种子
 * @param otherSeed 其他字母生成种子
 * @returns
 */
export const genName = function (len = 5, firstSeed = ['$', '_', ...letterUpSeed, ...letterLowSeed], otherSeed?) {
    if (isNum(len) && len > 1) {
        return generateRandomStr(1, firstSeed) + generateRandomStr(len - 1, otherSeed);
    } else {
        throw new Error('生成名字错误，长度必须大于1');
    }
};

/**
 * 获取UUID
 * @returns
 */
export const generateUUID = function () {
    return generateUnique('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx');
};

/**
 * 通过种子与编码位数获取UUID
 * @param seed
 * @param codingBits
 * @returns
 */
export const generateUnique = function (seed: number | string = 5, codingBits = 16) {
    return (function (global) {
        (typeof codingBits !== 'number' || codingBits < 2 || codingBits > 36) && (codingBits = 16);
        if (typeof seed === 'number' && seed > 0) {
            seed = 'x'.repeat(seed) + 'y';
        } else if (typeof seed !== 'string' || seed.length < 2) {
            seed = 'xxxxxxy';
        }
        var d = new Date().getTime();
        const performance: any = global.performance;
        if (performance && isFunc(performance.now)) {
            d += performance.now();
        }
        var uuid = seed.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * codingBits) % codingBits | 0;
            d = Math.floor(d / codingBits);
            return (c === 'x' ? r : (r & 0x3) | (codingBits / 2)).toString(codingBits);
        });
        return uuid;
    })(this || window || globalThis);
};

// 驼峰命名转烤串
export const camelToKebab = function (camelStr: string) {
    // 判断是否是大驼峰
    const isUpper = camelStr[0].charCodeAt(0) >= 65 && camelStr[0].charCodeAt(0) <= 90;
    const handleStr = camelStr.replace(/([A-Z])/g, '-$1').toLowerCase();
    let kebabStr = handleStr;
    if (isUpper) {
        kebabStr = handleStr.slice(1);
    }
    // 处理连续大写的情况
    const newKebabArr: Array<string> = [];
    const kebabSplitArr = kebabStr.split('-');
    kebabSplitArr.forEach((item, index) => {
        if (item.length > 1) {
            newKebabArr.push(item);
        } else {
            let combineStr = '';
            const subKebabArr = kebabSplitArr.slice(index);
            for (let i = 0; i < subKebabArr.length; i++) {
                if (subKebabArr[i].length > 1) break;
                combineStr += subKebabArr[i];
            }
            newKebabArr.push(combineStr);
            kebabSplitArr.splice(index + 1, combineStr.length - 1);
        }
    });
    return newKebabArr.join('-');
};

// 首字符大写
export const firstUpperCase = function (str) {
    if (isStr(str)) {
        return str.slice(0, 1).toUpperCase() + str.slice(1);
    } else {
        return str;
    }
};

// 首字符大写
export const firstLowerCase = function (str) {
    if (isStr(str)) {
        return str.slice(0, 1).toLocaleLowerCase() + str.slice(1);
    } else {
        return str;
    }
};

// 下划线转驼峰
export const lineToCamel = function (str) {
    if (isStr(str)) {
        return str.replace(/([^_])(?:_+([^_]))/g, function ($0, $1, $2) {
            return $1 + $2.toUpperCase();
        });
    } else {
        return str;
    }
};

// 下划线转大写驼峰
export const lineToUpCamel = function (str) {
    if (isStr(str)) {
        return firstUpperCase(lineToCamel(str));
    } else {
        return str;
    }
};

// 驼峰转下划线
export const camelToLine = function (str) {
    if (isStr(str)) {
        let temp = str.replace(/[A-Z]/g, function (match) {
            return '_' + match.toLowerCase();
        });
        // 如果首字母是大写，执行replace时会多一个_，这里需要去掉
        if (temp.slice(0, 1) === '_') {
            temp = temp.slice(1);
        }
        return temp;
    } else {
        return str;
    }
};
