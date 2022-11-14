## 时时工具包

### 安装方式

```shell
npm install @kjts20/tool
```

### 微信小程中使用指引

#### npm 构建

-   工具 -> 构建 npm

#### 实例化基础函数

-   新建 wx.tool.ts，最为全局处理类

```ts
import { isNum, isObj, isStr } from '@kjts20/tool';
const logger = wx.getRealtimeLogManager();

// 记录日志
export const sendErr = function (...args) {
    console.warn('发送错误：', ...args);
    logger.error(...args);
};

export const error = function (title, err: any = null, callback?, waitTime?) {
    console.warn('error函数提醒=>', { title, err });
    logger.warn('error函数提醒=>', title, err);
    wx.showToast({
        title: title || '系统开小差了～',
        icon: 'none',
        duration: 2500,
        complete: () => {
            if (typeof callback === 'function') {
                let time = parseInt(waitTime);
                time = isNaN(time) ? 0 : time;
                setTimeout(() => {
                    callback();
                }, time);
            }
        }
    });
};
```

-   新建 http-server.ts，作为请求类

```ts
import { HttpServer } from '@kjts20/tool';
import { error } from './wx.tool';
const host = '[host]';
const apiPrefix = '[apiPrefix]';
const getToken = () => '[token]';

export default new HttpServer({
    request: wx.request,
    uploadFile: wx.uploadFile,
    error,
    host: host,
    apiPrefix,
    getHeader: () => getToken(),
    responseIntercept(response: HttpResponse): HttpResponse {
        if (isObj(response)) {
            if (response.fail && response.code === 308) {
                // gotoLoginPage();
                throw new Error('重定向到登录页面');
            }
        }
        return response;
    }
});
```

-   新建 storage.ts，作为仓库类

```ts
import {Storage} from '@kjts20/tool';
import { error } from './wx.tool';
export default new Storage(
    {
        getStorage: wx.getStorage,
        getStorageSync: wx.getStorageSync,
        setStorage: wx.setStorage,
        setStorageSync: wx.setStorageSync,
        clearStorage: wx.clearStorage,
        removeStorage: wx.removeStorage
    },
    error
);
```

-   新建 http-filter.ts，作为过滤工具类

```ts
import { ResponseFilter } from '@kjts20/tool';
import { error } from './wx.tool';
export default new ResponseFilter({
    error
});
```

#### 页面使用

```ts
import httpServer from '../http-server';
import httpFilter from '../http-filter';
import db from '../storage';

// 请求分页数据
const getPage = function (params) {
    return httpFilter.filter(httpServer.postJson('[url]', params), responseData => {
        // ...
        return responseData;
    });
};
// 保存缓存
const test = function () {
    db.setStorageSync('ttt', 1);
    console.log('保存数据=>' + db.getStorageSync('ttt'));
};
```

### H5 使用指引
#### 使用axios初始化httpServer, utils/http-server.ts中
```TS
import { HttpServer, isObj, toJson } from "@kjts20/tool";
import Axios from 'axios'
const host = 'http://192.168.0.10:7001';
const apiPrefix = '';

export default new HttpServer({
    request(options){
        const {url, data, header, timeout, method, success, error, complete} = options;
        Axios.request({
            url, 
            data, 
            headers: header,
            timeout,
            method            
        }).then(res=>{
            if(isObj(res)){
                if(success){
                    success({
                        ...res,
                        statusCode: res.status
                    });
                }
            }else{
                if(error){
                    error(res);
                }
            }
           if(complete){
                complete(res);
           }
        }).catch(err=>{
            if(error){
                error(err);
            }
            if(complete){
                complete(err);
           }
        });
    },
    uploadFile(options){
        const {url, filePath, formData, header, timeout, method, success, error, complete} = options;
        Axios.request({
            url, 
            data: formData, 
            headers: header,
            timeout,
            method: "POSt",        
        }).then(res=>{
            if(isObj(res)){
                if(success){
                    success({
                        ...res,
                        statusCode: res.status
                    });
                }
            }else{
                if(error){
                    error(res);
                }
            }
           if(complete){
                complete(res);
           }
        }).catch(err=>{
            if(error){
                error(err);
            }
            if(complete){
                complete(err);
           }
        });
    },
    host: host,
    apiPrefix
});
```

#### 使用next初始化请求过滤类, response-filter.ts
``` TS
import { ResponseFilter  } from "@kjts20/tool";
import { Message } from '@alifd/next';

export default new ResponseFilter({
    error:(msg, err)=>{
        Message.error(msg + '');
        console.error("错误提示=>", err);
    }
});
```

#### 根据使用平台对几个类进行初始化

-   浏览器中使用 sessionStorage 实例化仓库

```TS
import {CommonStorage ,ISetStorageOptions, IGetStorageOptions, IRemoveStorageOptions, IClearStorageOptions } from '@kjts20/tool';

// 保存json的key
const saveJsonKey = function (key: number | string) {
    return key + 'sskj-json';
};

// 保存localStorage
const setLocalStorage = function (key, data) {
    try {
        let saveKey = key + '';
        let saveData = data;
        if (typeof data !== 'string') {
            saveKey = saveJsonKey(key);
            saveData = JSON.stringify(data);
        }
        localStorage.setItem(saveKey, saveData);
        return null;
    } catch (err) {
        return err;
    }
};

// 获取localStorage
const getLocalStoragee = function (key) {
    const getVal = k => localStorage.getItem(k);
    let val = getVal(saveJsonKey(key));
    if (typeof val === 'string') {
        return JSON.parse(val);
    } else {
        return getVal(key);
    }
};

// 导出默认仓库
export const storage =  new CommonStorage({
    setStorage(options: ISetStorageOptions) {
        const { key, data, success, fail } = options;
        const err = setLocalStorage(key, data);
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
        const err = setLocalStorage(key, data);
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
            const data = getLocalStoragee(key);
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
            return getLocalStoragee(key);
        } catch (err) {
            console.warn('获取sessionStorage错误', err);
            return undefined;
        }
    },
    removeStorage(options: IRemoveStorageOptions) {
        const { key, success, fail } = options;
        try {
            localStorage.removeItem(key + '');
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
            localStorage.clear();
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
```
