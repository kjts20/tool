/*
 * @Description: 对象工具
 * @Author: wkj
 * @Date: 2020-07-10 15:45:20
 * @LastEditTime: 2023-04-16 08:29:09
 * @LastEditors: wkj wkj@kjwoo.cn
 */
import { isArr, isFunc, isNum, isObj, isStr } from './type';
import { urlDecode } from './url';

// 任意对象
export interface IKeyVal {
    [key: string | string]: any;
}

// select选项
export interface ISelectOption {
    label: string;
    value: any;
}

// map的键类型
type TMapKeyType = string | number;

/**
 * 获取字段的值
 * @param data 值来源
 * @param name 名字
 * @param defaultValue 默认值
 * @returns
 */
export const getColumnValue = function (data, name, defaultValue?) {
    if (data) {
        if (name) {
            var nameArr: Array<any> = [];
            if (isStr(name)) {
                nameArr = name.split('.');
            } else if (isArr(name)) {
                nameArr = name;
            } else {
                nameArr.push(name);
            }
            var i = 0;
            let newData = data;
            if (nameArr.length > 0) {
                if (typeof newData === 'object' && newData !== null) {
                    const arrRe = /^\s*(.*?)\[(\d+)\]\s*$/;
                    const getVal = (data, key) => {
                        if (isObj(data)) {
                            if (arrRe.test(key)) {
                                const [newKey, index] = key.match(arrRe);
                                data = data[newKey];
                                if (isObj(data)) {
                                    return data[index];
                                } else {
                                    return defaultValue;
                                }
                            } else {
                                return data[key + ''] || defaultValue;
                            }
                        } else {
                            return defaultValue;
                        }
                    };
                    do {
                        newData = getVal(newData, nameArr[i]);
                        i++;
                    } while (nameArr.length > i && typeof newData === 'object' && newData !== null);
                }
                return newData || defaultValue;
            } else {
                return defaultValue;
            }
        } else {
            return data;
        }
    } else {
        return defaultValue;
    }
};

/**
 * 设置字段的值
 * @param data 赋值对象
 * @param name 名字（可以是：user.name）
 * @param value 值
 * @returns
 */
export const setDictValue = function <TData>(data: TData, name, value) {
    if (!data) {
        data = {} as TData;
    }
    var nameArr: Array<any> = [];
    if (isStr(name)) {
        nameArr = name.split('.');
    } else if (isArr(name)) {
        nameArr = name;
    } else {
        nameArr.push(name);
    }
    let tempData = data;
    const lastName = nameArr.pop();
    for (const it of nameArr) {
        if (!isObj(tempData[it])) {
            tempData[it] = {};
        }
        tempData = tempData[it];
    }
    tempData[lastName] = value;
    return data;
};

//【添加】wkj通过对象获取多级结构的值（ {my: {name: wkj}} my.name = 'wkj' )
export const getColumnValueAndRenderByName = function (name, data, render: any = null) {
    if (typeof name === 'string') {
        var nameArr = name.split('.');
        var i = 0;
        let newData = data;
        if (nameArr.length > 0) {
            if (typeof newData === 'object' && newData !== null) {
                const arrRe = /^\s*(.*?)\[(\d+)\]\s*$/;
                const getVal = (data, key) => {
                    if (typeof data === 'object' && data !== null) {
                        if (arrRe.test(key)) {
                            const [newKey, index] = key.match(arrRe);
                            data = data[newKey];
                            if (typeof data === 'object' && data !== null) {
                                return data[index];
                            } else {
                                return undefined;
                            }
                        } else {
                            return data[key];
                        }
                    } else {
                        return undefined;
                    }
                };
                do {
                    newData = getVal(newData, nameArr[i]);
                    i++;
                } while (nameArr.length > i && typeof newData === 'object' && newData !== null);
            }
            return typeof render === 'function' ? render(0, 0, newData) : newData;
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
};

/**
 * 深度克隆
 * @param obj 原值
 * @param debug
 * @returns
 */
export const deepClone = function <T>(obj: T, debug = true): T {
    try {
        return JSON.parse(JSON.stringify(obj));
    } catch (err) {
        if (debug) {
            console.error('深度克隆错误：', err);
        }
        return obj;
    }
};

/**
 * 字符串转json （保护转义）
 * @param str 格式化的正则
 * @param debug 是否调试
 * @returns
 */
export const toJson = function (str, debug = true) {
    try {
        if (typeof str === 'string' && str !== '') {
            //如果需要转义的
            const removeSenseRe = /([:\{\[,])\\"(.*?)\\"([:\}\],])/g;
            if (removeSenseRe.test(str)) {
                const removeText = '$1"$2"$3';
                str = str.replace(removeSenseRe, removeText).replace(removeSenseRe, removeText);
            }
            return JSON.parse(str);
        } else if (typeof str === 'object') {
            return str;
        } else {
            if (debug) {
                console.warn('不正确的json字符串', str);
            }
            return str;
        }
    } catch (err) {
        if (debug) {
            console.error('转json对象失败', err);
        }
        return str;
    }
};

/**
 * 获取数组
 * @param length 长度
 * @param fillOrFillFunc 添加内容/添加内容函数
 * @returns
 */
export const getArray = function <T = any>(length: number, fillOrFillFunc?: T | ((index: number) => T)): Array<T> {
    let len = Math.floor(length) || 0;
    return new Array(len).fill(null).map((_, i) => {
        if (isFunc(fillOrFillFunc)) {
            // @ts-ignore
            return fillOrFillFunc(i);
        } else {
            // 直接填充
            return fillOrFillFunc;
        }
    });
};

/**
 * 对象值过滤
 * @param obj
 * @param valHandler
 * @returns
 */
export const objFilter = function <TData>(obj: TData, valHandler?: (val) => boolean): TData {
    const newObj: any = {};
    if (isObj(obj)) {
        let itemFunc = typeof valHandler === 'function' ? valHandler : val => typeof val != 'undefined';
        for (const k in obj) {
            const it = obj[k];
            if (k && k !== 'undefined' && itemFunc(it)) {
                newObj[k] = it;
            }
        }
    }
    return newObj;
};

/**
 * 对象装饰
 * @param obj
 * @param valHandler
 * @returns
 */
export const objDecorate = function <TData>(obj: TData, valHandler?: (val) => any, keyHandler?: (key) => string | number): TData {
    const newObj: any = {};
    if (isObj(obj)) {
        let keyFunc = isFunc(keyHandler) ? valHandler : key => key + '';
        let valFunc = isFunc(valHandler) ? valHandler : val => val || '';
        for (const k in obj) {
            newObj[keyFunc(k)] = valFunc(obj[k]);
        }
    }
    return newObj;
};

/**
 * 数组转换为对象
 * @param data 列表数据
 * @param column 键的字段
 * @param itMapHandler
 * @returns
 */
export const list2Dict = function <TData = any>(data: Array<TData>, column: keyof TData | 'id' = 'id', valHandler?: (it: TData) => any) {
    // 字段默认是id
    if (typeof column !== 'string' || column === '') {
        console.warn('list2Dict字段不合法，已经使用默认字段id', column);
        column = 'id';
    }
    // @ts-ignore
    return biList2Dict(data, it => it[column], valHandler);
};

/**
 * 数组转换为对象
 * @param data 列表数据
 * @param keyHandler 键操作
 * @param valHandler 值操作
 * @returns
 */
export const biList2Dict = function <TData = any>(data: Array<TData>, keyHandler: (it: TData) => number | string, valHandler?: (it: TData) => any): any {
    // 数据处理
    if (Array.isArray(data)) {
        // 子项处理方法
        const itValHanlder = valHandler && isFunc(valHandler) ? valHandler : it => it;
        const newDict = {};
        data.forEach(it => {
            const key = keyHandler(it);
            if (isStr(key) || isNum(key)) {
                newDict[key] = itValHanlder(it);
            }
        });
        return newDict;
    } else if (typeof data === 'object' && data !== null) {
        return data;
    } else {
        console.warn('list2Dict数据错误', data);
        return {};
    }
};

/**
 * 字典转数组
 * @param data
 * @param keyColumn
 * @returns
 */
export const dict2List = function <TData = any>(data, keyColumn?: string): Array<TData> {
    return biDict2List(data, (it, key) => {
        if (isObj(it)) {
            if (keyColumn) {
                it[keyColumn] = key;
            }
        }
        return it;
    });
};

// 字典转数组
export const biDict2List = function <T = any, R = any>(data, itMapHandler?: (it: T, key: string) => R): Array<R> {
    if (Array.isArray(data)) {
        return data;
    } else if (typeof data === 'object' && data !== null) {
        const newArr: Array<R> = [];
        for (const k in data) {
            newArr.push(itMapHandler(data[k], k));
        }
        return newArr;
    } else {
        return [];
    }
};

// 对象一样（值）
export const objEq = function (obj1, obj2) {
    if (isObj(obj1) && isObj(obj2)) {
        const obj1Key = Object.keys(obj1);
        const obj2Key = Object.keys(obj2);
        if (obj1Key.length == obj2Key.length) {
            for (let i = 0; i < obj1Key.length; i++) {
                let k = obj1Key[i];
                if (!obj2Key.includes(k) || JSON.stringify(urlDecode(obj1[k])) !== JSON.stringify(urlDecode(obj2[k]))) {
                    return false;
                }
            }
            return true;
        }
    }
    return false;
};

// 字符串转json字符串
export const json2Obj = function (str) {
    if (isStr(str)) {
        try {
            return JSON.parse(str);
        } catch (err) {
            console.warn('转对象错误=>', str, err);
            return str;
        }
    } else {
        return str;
    }
};

// 查找列表中索引
export const getListIndex = function <T>(list: Array<T>, predicate: (it: T) => boolean) {
    if (isArr(list) && isFunc(predicate)) {
        for (let i = 0; i < list.length; i++) {
            if (predicate(list[i])) {
                return i;
            }
        }
    }
    return -1;
};

// 属性去重
export const listRemoteRepeat = function <T>(data: Array<T>, column: keyof T | 'id' = 'id', filter: (it: T) => T = it => it) {
    const newList = data.map(it => filter({ ...it }));
    const dict = list2Dict(newList, column);
    return dict2List(dict, '');
};

// 配置合并（后面配置覆盖前面的配置）
export const mergeObj = function <T>(baseConfig: T, ...configs) {
    const conf: T = { ...(baseConfig || {}) } as T;
    function merge(conf1, conf2) {
        if (isObj(conf1) && isObj(conf2)) {
            for (const k in conf2) {
                if (isObj(conf1[k]) && isObj(conf2[k])) {
                    merge(conf1[k], conf2[k]);
                } else {
                    // 只有两个值都是对象才必要合并下去，那么就直接覆盖到原配置
                    try {
                        conf1[k] = conf2[k];
                    } catch (e) {
                        console.error('属性无法写入=>', e);
                        console.log(typeof conf1[k], typeof conf2[k]);
                    }
                }
            }
        }
    }
    for (const config of configs) {
        merge(conf, config);
    }
    return conf;
};

// 移除属性
export const removeObjColumns = function <T>(obj: T, ...columns: Array<keyof T>) {
    const goal: T = { ...(obj || ({} as T)) };
    for (const column of columns) {
        delete goal[column];
    }
    return goal;
};

// 移除属性
export const removeObjectUndefined = function <T = any>(obj: T): T {
    if (obj != null) {
        for (const key in obj) {
            if (typeof obj[key] === 'undefined') delete obj[key];
        }
        return obj;
    } else {
        return {} as T;
    }
};

/**
 * 是否相同
 * @param arg1 第一个参数
 * @param arg2 第二个参数
 */
export const isSame = function (arg1, arg2): boolean {
    if (!isObj(arg1) && !isObj(arg2)) {
        // eslint-disable-next-line
        return arg1 == arg2;
    } else {
        return JSON.stringify(arg1) === JSON.stringify(arg2);
    }
};

/**
 * 获取更新数据
 * @param before 修改之前
 * @param after 修改之后
 */
export const getChangeData = function (before: object, after: object) {
    if (before == null) {
        return after || {};
    } else if (after == null) {
        return before || {};
    } else {
        const changeData = {};
        const beforeKeys = Object.keys(before);
        for (const key in after) {
            const it = after[key];
            if (!beforeKeys.includes(key) || !isSame(before[key], it)) {
                changeData[key] = it;
            }
        }
        return changeData;
    }
};

/**
 * 分组
 * @param list 需要分组的数组
 * @param keyName 分组的键名
 * @returns
 */
interface IDictArrItem<T> {
    [key: string]: Array<T>;
    [key: number]: Array<T>;
}
export const listGroupBy = function <T extends {}>(list: Array<T>, keyName: keyof T): IDictArrItem<T> {
    const dict: IDictArrItem<T> = {};
    if (list && list.length > 0 && isStr(keyName)) {
        list.forEach(it => {
            if (it) {
                const groupKey: TMapKeyType = it[keyName] as any;
                if (!isArr(dict[groupKey])) {
                    dict[groupKey] = [];
                }
                dict[groupKey].push(it);
            }
        });
    }
    return dict;
};

/**
 * 获取列表和
 * @param list 列表
 * @param getNumFunc 获取数字 函数
 */
export const getListSum = function <T>(list: Array<T>, getNumFunc: (it: T) => number): number {
    let sum = 0;
    if (list && isArr(list)) {
        for (const it of list) {
            if (it) {
                sum += getNumFunc(it);
            }
        }
    }
    return sum;
};

/**
 * 获取列表中最大值
 * @param list 列表
 * @param getNumFunc 获取数字函数
 */
export const getListMax = function <T>(list: Array<T>, getNumFunc: (it: T) => number): number {
    let max = 0;
    if (list && isArr(list)) {
        for (const it of list) {
            if (it) {
                const num = getNumFunc(it);
                if (max < num) {
                    max = num;
                }
            }
        }
    }
    return max;
};

// 数组合并
export const listConcat = function <T>(list: Array<T>, itemList: Array<T>) {
    if (!isArr(list)) {
        list = [];
    }
    if (isArr(itemList)) {
        for (const item of itemList) {
            list.push(item);
        }
        return list;
    } else {
        return list;
    }
};

// 列表加法运算
export const listAddition = function (list: Array<number>, addNum: Array<number> | number) {
    if (!isArr(list) || list.length > 0) return list;
    const newList = [...list];
    if (typeof addNum === 'number') {
        const num = Number(addNum) || 0;
        for (let i = 0; i < newList.length; i++) {
            newList[i] = (Number(newList[i]) || 0) + num;
        }
    } else {
        for (let i = 0; i < newList.length; i++) {
            newList[i] = (Number(newList[i]) || 0) + (Number(addNum[i]) || 0);
        }
    }
    return newList;
};

// 生成对象
export const toObj = function (key, val) {
    const obj = {};
    obj[key] = val;
    return obj;
};

// 获取键值
export const getValueIndex = function (listData, findHandler: (it: any) => boolean) {
    for (let i = 0; i < listData.length; i++) {
        if (findHandler(listData[i])) {
            return i;
        }
    }
    return -1;
};
