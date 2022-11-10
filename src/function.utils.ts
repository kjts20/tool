/*
 * @Description: 转换为函数
 * @Author: wkj
 * @Date: 2020-09-24 17:50:43
 * @LastEditTime: 2020-09-24 17:53:13
 * @LastEditors: wkj
*/
export const toFunction = (val) => {
    if (typeof val === 'string' && val !== '') {
        try {
            return new Function('return ' + val)();
        } catch (err) {
            console.error('无法把字符串转换为函数', err);
            return undefined;
        }
    } else {
        return undefined;
    }
};
