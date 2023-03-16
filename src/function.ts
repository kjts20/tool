import { isObj } from './type';
/*
 * @Description: 转换为函数
 * @Author: wkj
 * @Date: 2020-09-24 17:50:43
 * @LastEditTime: 2020-09-24 17:53:13
 * @LastEditors: wkj
 */
export const toFunction = function (val, context = {}) {
    if (typeof val === 'string' && val !== '') {
        try {
            // 使用的上下文
            const useContext = isObj(context) ? context : {};
            // 构造函数
            const funcName = '__FUNCTION__';
            const functionContent = `
                const {${Object.keys(useContext).join(',')}} = this;
                const  ${funcName} = ${val};
            `;
            return new Function(`${functionContent};return ${funcName}`).call(useContext);
        } catch (err) {
            console.error('无法把字符串转换为函数', err);
            return null;
        }
    } else {
        return null;
    }
};
