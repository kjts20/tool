/*
 * @Author: wkj（wkj.kjwoo.cn）
 * @Date: 2022-12-07 22:24:31
 * @LastEditTime: 2023-07-07 23:16:14
 * @Description: json相关
 */
import { isStr } from './type';

/**
 * 深度克隆（对象）
 * @param obj 克隆对象
 */
export const deepCopy = function (obj) {
    if (obj) {
        return JSON.parse(JSON.stringify(obj));
    } else {
        return obj;
    }
};

/**
 * json字符串转对象
 * @param josnStr
 * @param debug
 * @returns
 */
export const jsonParse = function (josnStr, debug = false) {
    if (isStr(josnStr)) {
        try {
            return JSON.parse(josnStr);
        } catch (e) {
            debug && console.warn('转json错误=>', e);
            return null;
        }
    } else {
        return null;
    }
};
