/*
 * @Author: wkj（wkj.kjwoo.cn）
 * @Date: 2022-12-07 22:24:31
 * @LastEditTime: 2023-07-08 11:19:37
 * @Description: 数学函数
 */

import { isNum, isStr } from './type';

/**
 * 求数组和
 * @param arr
 * @param itemCb
 * @returns
 */
export const arrSum = function (arr: any[], itemCb?) {
    let sum = 0;
    if (!Array.isArray(arr)) {
        arr = [arr];
    }
    const itemDeal = typeof itemCb === 'function' ? itemCb : Number;
    for (const it of arr) {
        let val = itemDeal(it);
        if (!isNaN(val)) {
            sum += val;
        }
    }
    return sum;
};

/**
 * 求数组平均数
 * @param arr
 * @returns
 */
export const arrAverage = function (arr: number[]) {
    const sum = arrSum(arr);
    if (Array.isArray(arr)) {
        return sum / arr.length;
    } else {
        return sum;
    }
};

// 获取数组长度
export const getLen = function (data) {
    if (Array.isArray(data)) {
        return data.length;
    } else if (isStr(data)) {
        return data.length;
    } else if (isNum(data)) {
        const temp = parseInt(data);
        return isNaN(temp) ? 0 : (temp + '').length;
    } else {
        debugger;
        throw new Error('获取长度失败');
    }
};
