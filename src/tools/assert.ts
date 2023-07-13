/*
 * @Author: wkj（wkj.kjwoo.cn）
 * @Date: 2023-03-28 00:57:35
 * @LastEditTime: 2023-07-13 07:48:06
 * @Description: 断言方法
 */
import { isObj } from '../utils/type';

export const Assert = {
    isTrue(expression, msg, err?, ...args) {
        if (!expression) {
            console.error(`[${msg}]=>`, err, ...args);
            throw { msg, err };
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
