/*
 * @Author: wkj（wkj.kjwoo.cn）
 * @Date: 2023-03-28 00:57:35
 * @LastEditTime: 2023-07-08 12:15:03
 * @Description: 断言方法
 */
import { isObj } from '../utils/type';
export const Assert = {
    isTrue(expression, msg, ...args) {
        if (!expression) {
            console.error(`[${msg}]=>`, ...args);
            throw new Error(msg);
        }
    },
    isFalse(expression, msg, ...args) {
        this.isTrue(!expression, msg, ...args);
    },
    error(msg, ...args) {
        this.isTrue(false, msg, ...args);
    },
    notNull(expression, msg, ...args) {
        this.isTrue(expression == null, msg, ...args);
    },
    isNull(expression, msg, ...args) {
        this.isTrue(expression !== null, msg, ...args);
    },
    isObj(obj, msg, ...args) {
        this.isTrue(isObj(obj), msg, ...args);
    }
};
