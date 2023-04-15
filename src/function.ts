/*
 * @Description: 转换为函数
 * @Author: wkj
 * @Date: 2020-09-24 17:50:43
 * @LastEditTime: 2023-04-15 08:50:54
 * @LastEditors: wkj wkj@kjwoo.cn
 */
import { isObj } from './type';

export const toFunction = function (val, context = {}) {
    if (typeof val === 'string' && val !== '') {
        // 使用的上下文
        const useContext = isObj(context) ? context : {};
        // 构造函数
        const funcName = '__FUNCTION__';
        const functionContent = `
             const {${Object.keys(useContext).join(',')}} = this;
             const  ${funcName} = ${val};
         `;
        return new Function(`${functionContent};return ${funcName}`).call(useContext);
    } else {
        return null;
    }
};
