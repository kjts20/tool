import CommonStorage, { ISetStorageOptions, IGetStorageOptions, IRemoveStorageOptions, IClearStorageOptions } from './core/storage';

// 保存json的key
const saveJsonKey = function (key: number | string) {
    return key + 'sskj-json';
};

// 保存sessionStorage
const setSessionStorage = function (key, data) {
    try {
        let saveKey = key + '';
        let saveData = data;
        if (typeof data !== 'string') {
            saveKey = saveJsonKey(key);
            saveData = JSON.stringify(data);
        }
        sessionStorage.setItem(saveKey, saveData);
        return null;
    } catch (err) {
        return err;
    }
};

// 获取sessionStorage
const getSessionStorage = function (key) {
    const getVal = k => sessionStorage.getItem(k);
    let val = getVal(saveJsonKey(key));
    if (typeof val === 'string') {
        return JSON.parse(val);
    } else {
        return getVal(key);
    }
};

export default new CommonStorage({
    setStorage(options: ISetStorageOptions) {
        const { key, data, success, fail } = options;
        const err = setSessionStorage(key, data);
        if (err === null) {
            if (success) {
                success({ errMsg: 'setStorage:ok', err });
            }
            return true;
        } else {
            if (fail) {
                fail({ errMsg: '保存错误', err });
            }
            return false;
        }
    },
    setStorageSync(key: number | string, data) {
        const err = setSessionStorage(key, data);
        if (err == null) {
            return true;
        } else {
            console.warn('保存sessionStorage错误', err);
            return false;
        }
    },
    getStorage(options: IGetStorageOptions) {
        const { key, success, fail } = options;
        try {
            const data = getSessionStorage(key);
            if (success) {
                success({ data });
            }
            return true;
        } catch (err) {
            if (fail) {
                fail({ errMsg: '获取值错误', err });
            }
            return false;
        }
    },
    getStorageSync(key: number | string) {
        try {
            return getSessionStorage(key);
        } catch (err) {
            console.warn('获取sessionStorage错误', err);
            return undefined;
        }
    },
    removeStorage(options: IRemoveStorageOptions) {
        const { key, success, fail } = options;
        try {
            sessionStorage.removeItem(key + '');
            if (success) {
                success({ errMsg: 'removeStorage:ok' });
            }
            return true;
        } catch (err) {
            if (fail) {
                fail({ errMsg: '获取值错误', err });
            }
            return false;
        }
    },
    clearStorage(options: IClearStorageOptions) {
        const { success, fail } = options;
        try {
            sessionStorage.clear();
            if (success) {
                success({ errMsg: 'clearStorage:ok' });
            }
            return true;
        } catch (err) {
            if (fail) {
                fail({ errMsg: '获取值错误', err });
            }
            return false;
        }
    }
});
