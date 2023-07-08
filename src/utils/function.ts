/*
 * @Author: wkj（wkj.kjwoo.cn）
 * @Date: 2023-04-21 18:32:54
 * @LastEditTime: 2023-07-08 10:40:44
 * @Description: 转换为函数
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
