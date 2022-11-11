import { isNum, isStr } from "../type";

/**
 * 检查保存的key
 * @param key
 * @returns
 */
export const checkKey = function (key: string | number) {
  return new Promise((resolve: (saveKey: string | number) => void, reject) => {
    if (isStr(key) || isNum(key)) {
      resolve(key);
    } else {
      reject("键值不存在");
    }
  });
};

/**
 * 检查保存的key（同步）
 * @param key
 * @returns
 */
export const checkKeySync = function (key: string | number) {
  if (isStr(key) || isNum(key)) {
    return true;
  } else {
    throw new Error("保存的键必须是合法字符串");
  }
};

// 设置仓库参数
export interface ISetStorageOptions {
  key: string | number;
  data: any;
  success?: (res: { errMsg?: string; [key: string]: any }) => void;
  fail?: (res: any) => void;
}

// 获取仓库参数
export interface IGetStorageOptions<T = any> {
  key: string | number;
  success?: (res: { errMsg?: string; [key: string]: any; data: T }) => void;
  fail?: (res: any) => void;
}

// 移除仓库配置项
export interface IRemoveStorageOptions {
  key: string | number;
  success?: (res: { errMsg?: string; [key: string]: any }) => void;
  fail?: (res: any) => void;
}

// 清空配置项
export interface IClearStorageOptions {
  success?: (res: { errMsg?: string; [key: string]: any }) => void;
  fail?: (res: any) => void;
}

// 错误函数
export type TErrFunc = (errMsg: string | number, data: any) => void;

// 使用api限制
export interface IStorageApi {
  setStorage: (options: ISetStorageOptions) => boolean;
  setStorageSync: <T = any>(key: string | number, data: T) => boolean;
  getStorage: <T = any>(options: IGetStorageOptions<T>) => boolean;
  getStorageSync: <T = any>(key: string | number) => T | null;
  removeStorage: (options: IRemoveStorageOptions) => boolean;
  clearStorage: (options?: IClearStorageOptions) => boolean;
}

export default class CommonStorage {
  constructor(api: IStorageApi, unifyErrFunc?: TErrFunc) {
    this.storageApi = api;
    if (unifyErrFunc) {
      this.error = unifyErrFunc;
    }
  }
  // 仓库api
  storageApi: IStorageApi;
  // 错误函数
  error: TErrFunc = console.error;

  // 保存值
  setStorage(key: string, data) {
    return new Promise((resolve: (res: any) => void, reject) => {
      checkKey(key)
        .then((k) => {
          this.storageApi.setStorage({
            key: k,
            data: data,
            success: ({ errMsg }) => {
              resolve(data);
            },
            fail: ({ errMsg }) => {
              reject(errMsg);
            },
          });
        })
        .catch(reject);
    });
  }
  // [同步]设置值
  setStorageSync<T = any>(key: string | number, data: T) {
    try {
      checkKeySync(key);
      this.storageApi.setStorageSync(key, data);
      return data;
    } catch (err) {
      this.error("获取缓存错误=>", err);
      return null;
    }
  }

  // 获取本地缓存
  getStorage<T = any>(key: string | number) {
    return new Promise((resolve: (res: any) => void, reject) => {
      checkKey(key)
        .then((k) => {
          this.storageApi.getStorage<T>({
            key: k,
            success: ({ data, errMsg }) => {
              resolve(data);
            },
            fail: ({ errMsg }) => {
              reject(errMsg);
            },
          });
        })
        .catch(reject);
    });
  }
  getStorageSync<T = any>(key: string | number) {
    try {
      checkKeySync(key);
      return this.storageApi.getStorageSync<T>(key);
    } catch (err) {
      this.error("获取缓存错误=>", err);
      return null;
    }
  }

  /**
   * 删除一个键
   * @param key 键
   * @returns
   */
  removeStorage(key: string | number) {
    return new Promise((resolve: (res: boolean) => void, reject) => {
      checkKey(key)
        .then((k) => {
          this.storageApi.removeStorage({
            key: k,
            success: () => {
              resolve(true);
            },
            fail: ({ errMsg }) => {
              reject(errMsg);
            },
          });
        })
        .catch(reject);
    });
  }

  /**
   * 清空仓库
   * @returns
   */
  clearStorage() {
    return new Promise((resolve, reject) => {
      this.storageApi.clearStorage({
        success: ({ errMsg }) => {
          resolve(true);
        },
        fail: ({ errMsg }) => {
          reject(errMsg);
        },
      });
    });
  }
}
