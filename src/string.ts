/*
 * @Description: 字符串工具
 * @Author: wkj
 * @Date: 2020-07-08 14:27:21
 * @LastEditTime: 2022-11-22 22:46:46
 * @LastEditors: wkj wkj@kjwoo.cn
 */
import { hexMD5 } from './lib/md5';
import { isFunc, isStr } from './type';
// 全空格
export const allSpace = '　';

//替换前后空格获取特定的字符串
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

//获取随机字符串
export const generateRandomStr = function (len?) {
    len = parseInt(len);
    len = isNaN(len) || len <= 0 ? 7 : len;
    var seed = [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        'q',
        'u',
        'v',
        'w',
        'y',
        'z',
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
    var str = '';
    var seedLen = seed.length;
    for (var i = 0; i < len; i++) {
        str += seed[Math.floor(Math.random() * seedLen)];
    }
    return str;
};

//获取UUID
export const generateUUID = function () {
    return generateUnique('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx');
};

//通过种子与编码位数获取UUID
export const generateUnique = function (seed: number | string = 5, codingBits = 16) {
    (typeof codingBits !== 'number' || codingBits < 2 || codingBits > 36) && (codingBits = 16);
    if (typeof seed === 'number' && seed > 0) {
        seed = 'x'.repeat(seed) + 'y';
    } else if (typeof seed !== 'string' || seed.length < 2) {
        seed = 'xxxxxxy';
    }
    var d = new Date().getTime();
    // @ts-ignore
    const performance: any = window.performance;
    if (performance && isFunc(performance.now)) {
        // use high-precision timer if available
        d += performance.now();
    }
    var uuid = seed.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * codingBits) % codingBits | 0;
        d = Math.floor(d / codingBits);
        return (c === 'x' ? r : (r & 0x3) | (codingBits / 2)).toString(codingBits);
    });
    return uuid;
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

// 正则判断字符串格式(非空)
const judgeFormat = function (str, re: RegExp): boolean {
    if (isStr(str)) {
        if (re && isFunc(re.test)) {
            return re.test(trim(str));
        } else {
            console.error('无法校验格式=>', re, str);
            throw new Error('正则错误，无法校验格式');
        }
    } else {
        return false;
    }
};

// 是否电子邮件
export const isEmail = function (str) {
    return judgeFormat(str, /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/);
};

// 判断是否为手机号
export const isPhone = function (str) {
    return judgeFormat(str, /^[1][3,4,5,7,8,9][0-9]{9}$/);
};

// 判断是否为电话号码
export const isTel = function (str) {
    return judgeFormat(str, /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/);
};
