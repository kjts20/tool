declare const getColumnValue: (data: any, name: any, defaultValue?: any) => any;
declare const setDictValue: (data: any, name: any, value: any) => any;
declare const getColumnValueAndRenderByName: (name: any, data: any, render?: any) => any;
declare const deepClone: <T>(obj: T) => T;
declare const toJson: (str: any) => any;
declare const getArray: <T>(length: any, fill: T) => T[];
declare const filterObj: (obj: any, itemDecorate?: any) => {};
declare const list2Dict: <T>(data: T[], column?: keyof T | "id", itMapHandler?: (it: any) => any) => any;
declare const biList2Dict: <T>(data: T[], keyGenerater: (it: any) => number | string, itMapHandler?: (it: any) => any) => any;
declare const dict2List: (data: any, keyColumn?: any) => any[];
declare const objEq: (obj1: any, obj2: any) => boolean;
declare const json2Obj: (str: any) => any;
declare const getListIndex: <T>(list: T[], predicate: (it: T) => boolean) => number;
declare const listRemoteRepeat: <T>(data: T[], column?: "id" | keyof T, filter?: (it: T) => T) => any[];
declare const mergeObj: <T>(baseConfig: T, ...configs: any[]) => T;
declare const removeObjColumns: <T>(obj: T, ...columns: (keyof T)[]) => T;
declare const removeObjectUndefined: <T = any>(obj: T) => T;
/**
 * 是否相同
 * @param arg1 第一个参数
 * @param arg2 第二个参数
 */
declare const isSame: (arg1: any, arg2: any) => boolean;
/**
 * 获取更新数据
 * @param before 修改之前
 * @param after 修改之后
 */
declare const getChangeData: (before: object, after: object) => object;
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
declare const listGroupBy: <T extends {}>(list: T[], keyName: keyof T) => IDictArrItem<T>;
/**
 * 获取列表和
 * @param list 列表
 * @param getNumFunc 获取数字 函数
 */
declare const getListSum: <T>(list: T[], getNumFunc: (it: T) => number) => number;
/**
 * 获取列表中最大值
 * @param list 列表
 * @param getNumFunc 获取数字函数
 */
declare const getListMax: <T>(list: T[], getNumFunc: (it: T) => number) => number;
declare const listConcat: <T>(list: T[], itemList: T[]) => T[];
declare const listAddition: (list: Array<number>, addNum: Array<number> | number) => number[];
declare const toObj: (key: any, val: any) => {};
declare const getValueIndex: (listData: any, findHandler: (it: any) => boolean) => number;

export { biList2Dict, deepClone, dict2List, filterObj, getArray, getChangeData, getColumnValue, getColumnValueAndRenderByName, getListIndex, getListMax, getListSum, getValueIndex, isSame, json2Obj, list2Dict, listAddition, listConcat, listGroupBy, listRemoteRepeat, mergeObj, objEq, removeObjColumns, removeObjectUndefined, setDictValue, toJson, toObj };
