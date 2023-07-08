/*
 * @Author: wkj（wkj.kjwoo.cn）
 * @Date: 2023-07-08 12:12:11
 * @LastEditTime: 2023-07-08 12:12:37
 * @Description: 表单工具
 */
import { isArr, isObj } from '../utils/type';
import { IKeyVal } from '../utils/object';

/**
 * 多级转一级
 * 用法：一般对象转form表单
 *     {user: {name: "wkj"}, test: {status: true}} =>  {"user.name": "wkj", "test.status": true}
 * @params obj 一般对象
 */
export const toFormData = function (obj) {
    const goalData = {};
    function obj2FormData(data, prefix: string[] = []) {
        if (isObj(data) && !isArr(data)) {
            for (const key in data) {
                obj2FormData(data[key], [...prefix, key]);
            }
        } else {
            goalData[prefix.join('.')] = data;
        }
    }
    if (isObj(obj)) {
        obj2FormData(obj);
    }
    return goalData;
};

/**
 * 一级转多级
 * 用法： form表单转对象
 *     {"user.name": "wkj", "test.status": true} => {user: {name: "wkj"}, test: {status: true}}
 * @params formData 表单数据
 */
export const formData2Obj = function (formData) {
    const data: IKeyVal = {};
    if (isObj(formData)) {
        for (const key in formData) {
            let tmp = data;
            const ks = (key + '').split('.');
            for (let i = 0; i < ks.length; ) {
                const k = ks[i];
                if (++i === ks.length) {
                    tmp[k] = formData[key];
                } else {
                    !isObj(tmp[k]) && (tmp[k] = {});
                    tmp = tmp[k];
                }
            }
        }
    }
    return data;
};
