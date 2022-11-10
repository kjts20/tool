/**
 * 检查保存的key
 * @param key
 * @returns
 */
declare const checkKey: (key: string | number) => Promise<string | number>;
/**
 * 检查保存的key（同步）
 * @param key
 * @returns
 */
declare const checkKeySync: (key: string | number) => boolean;
interface ISetStorageOptions {
    key: string | number;
    data: any;
    success?: (res: {
        errMsg?: string;
        [key: string]: any;
    }) => void;
    fail?: (res: any) => void;
}
interface IGetStorageOptions<T = any> {
    key: string | number;
    success?: (res: {
        errMsg?: string;
        [key: string]: any;
        data: T;
    }) => void;
    fail?: (res: any) => void;
}
interface IRemoveStorageOptions {
    key: string | number;
    success?: (res: {
        errMsg?: string;
        [key: string]: any;
    }) => void;
    fail?: (res: any) => void;
}
interface IClearStorageOptions {
    success?: (res: {
        errMsg?: string;
        [key: string]: any;
    }) => void;
    fail?: (res: any) => void;
}
declare type TErrFunc = (errMsg: string | number, data: any) => void;
interface IStorageApi {
    setStorage: (options: ISetStorageOptions) => boolean;
    setStorageSync: <T = any>(key: string | number, data: T) => boolean;
    getStorage: <T = any>(options: IGetStorageOptions<T>) => boolean;
    getStorageSync: <T = any>(key: string | number) => T | null;
    removeStorage: (options: IRemoveStorageOptions) => boolean;
    clearStorage: (options?: IClearStorageOptions) => boolean;
}
declare class CommonStorage {
    constructor(api: IStorageApi, unifyErrFunc?: TErrFunc);
    storageApi: IStorageApi;
    error: TErrFunc;
    setStorage(key: string, data: any): Promise<any>;
    setStorageSync<T = any>(key: string | number, data: T): T;
    getStorage<T = any>(key: string | number): Promise<any>;
    getStorageSync<T = any>(key: string | number): T;
    /**
     * 删除一个键
     * @param key 键
     * @returns
     */
    removeStorage(key: string | number): Promise<boolean>;
    /**
     * 清空仓库
     * @returns
     */
    clearStorage(): Promise<unknown>;
}

export { IClearStorageOptions, IGetStorageOptions, IRemoveStorageOptions, ISetStorageOptions, IStorageApi, TErrFunc, checkKey, checkKeySync, CommonStorage as default };
