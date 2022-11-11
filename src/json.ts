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
//  json字符串转对象
export const jsonParse = function (josnStr) {
    if (isStr(josnStr)) {
        try {
            return JSON.parse(josnStr);
        } catch (e) {
            return null;
        }
    } else {
        return null;
    }
};
